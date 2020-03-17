import Sequelize from 'sequelize'
import dayjs from 'dayjs'
import assert from 'assert'

import models from '../models'
import {
  PLATFORM_NAMES,
  TWITTER_LIST_NAMES,
} from '../constants'
import { STATEMENT_SCRAPER_NAMES } from '../workers/scrapers/constants'
import AbstractNewsletter from './AbstractNewsletter'
import {
  NEWSLETTER_SETTINGS,
  MAILING_LISTS,
  NEWSLETTER_MEDIA,
} from './constants'
import { getTwitterScreenNamesByListName } from '../utils/newsletters'

const {
  sequelize,
  Claim,
} = models

class NationalNewsletter extends AbstractNewsletter {
  getMailingList = () => MAILING_LISTS.NATIONAL

  getPathToTemplate = () => `${__dirname}/templates/national.hbs`

  getPathToTextTemplate = () => `${__dirname}/templates/nationalText.hbs`

  getSubject = () => {
    const platformNames = [
      PLATFORM_NAMES.CNN,
      PLATFORM_NAMES.TWITTER,
    ]
    const date = dayjs().format('MM/DD/YY')
    return `Tech & Check Alerts: ${platformNames.join(', ')} ${date}`
  }

  assertNewsletterIsSendable = async () => {
    const bodyData = await this.getCachedBodyData()
    const totalClaims = Object.keys(bodyData.claims)
      .reduce((total, medium) => (total + bodyData.claims[medium].length), 0)
    assert(totalClaims > 0, 'There are claims to share.')
  }

  /**
   * Generates the query parameters for fetching claims.
   *
   * Requires the additional `where` conditions in Sequelize syntax that will be merged with
   * default conditions and other query parameters.
   *
   * @param {Object} where The where conditions for this specific claim query
   * @return {Object}      Query params ready for fetching claims
   */
  generateQueryParams = where => ({
    where: {
      ...where,
      claimedAt: {
        [Sequelize.Op.gte]: dayjs().startOf('hour').subtract(1, 'day').format(),
        [Sequelize.Op.lt]: dayjs().startOf('hour').format(),
      },
    },
    limit: NEWSLETTER_SETTINGS.DEFAULT.CLAIM_LIMIT,
    order: [['claimBusterScore', 'DESC']],
  })

  // TODO / NOTE: the use of SQL in method is poor form and duplicates the parameters
  // created in generateQuery.  This is intentional and understood because ultimately
  // we feel that known_speakers should eventually be explicitly linked via association
  // to the claims table.
  //
  // Until we have identity resolution, that link cannot be explicit.
  //
  // There was consideration of using a view instead, but since views are not formally
  // supported by Sequelize, we felt that an ad hoc query was the best approach (until the
  // aforementioned identity resolution is addressed)
  //
  // Furthermore, we felt that a newsletter-specific query did not belong in a generic
  // model and would be better kept here.
  //
  // Sequelize doesn't allow us to extract SQL from query objects, which is why we have to
  // manually reproduce the parameters of generateQuery.  There is an open issue related
  // to this, which may eventually translated to a feature we might use here.
  //
  // https://github.com/sequelize/sequelize/issues/2325
  fetchTvClaims = async () => {
    const startTime = dayjs().startOf('hour').subtract(1, 'day').format()
    const endTime = dayjs().startOf('hour').format()

    // Selects claims, prioritizing claims made by known speakers
    const rawQuery = `SELECT claims.*
      FROM claims
      LEFT JOIN (
        SELECT DISTINCT ON (known_speakers.first_name, known_speakers.last_name)
          known_speakers.*
          FROM known_speakers
        ) as distinct_known_speakers ON (
        LOWER(claims.speaker_normalized_name) = LOWER(CONCAT(
          distinct_known_speakers.first_name,
          ' ',
          distinct_known_speakers.last_name
        ))
       )
      WHERE claims.claimed_at >= '${startTime}'
        AND claims.claimed_at < '${endTime}'
        AND scraper_name = '${STATEMENT_SCRAPER_NAMES.CNN_TRANSCRIPT}'
        AND claims.id IN (
          SELECT MIN(claims.id)
            FROM claims
            WHERE claims.claimed_at >= '${startTime}'
              AND claims.claimed_at < '${endTime}'
              AND scraper_name = '${STATEMENT_SCRAPER_NAMES.CNN_TRANSCRIPT}'
            GROUP BY claims.content
        )
      ORDER BY (distinct_known_speakers.id IS NULL),
        claims.claim_buster_score DESC
      LIMIT ${NEWSLETTER_SETTINGS.DEFAULT.CLAIM_LIMIT}`

    return sequelize.query(rawQuery, {
      model: Claim,
      mapToModel: true,
    })
  }

  fetchSocialClaims = async () => (Claim.findAll(this.generateQueryParams({
    scraperName: STATEMENT_SCRAPER_NAMES.TWITTER_ACCOUNT,
    source: {
      [Sequelize.Op.in]: await getTwitterScreenNamesByListName(TWITTER_LIST_NAMES.NATIONAL),
    },
  })))

  getBodyData = async () => ({
    claims: {
      [NEWSLETTER_MEDIA.TV]: await this.fetchTvClaims(),
      [NEWSLETTER_MEDIA.SOCIAL]: await this.fetchSocialClaims(),
    },
  })
}

export default NationalNewsletter
