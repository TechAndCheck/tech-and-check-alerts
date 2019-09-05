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

const { Claim } = models

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
   * Requires the additional scope (`where` conditions) in Sequelize syntax that will be merged
   * with default scopes and other query parameters.
   *
   * @param {Object} scope The scope for this specific claim query, in Sequelize syntax
   * @return {Object}      Query params ready for fetching claims with all newsletter scoping
   */
  generateQueryParamsWithScope = scope => ({
    where: {
      ...scope,
      createdAt: {
        [Sequelize.Op.gte]: dayjs().startOf('hour').subtract(1, 'day').format(),
        [Sequelize.Op.lt]: dayjs().startOf('hour').format(),
      },
    },
    limit: NEWSLETTER_SETTINGS.DEFAULT.CLAIM_LIMIT,
    order: [['claimBusterScore', 'DESC']],
  })

  fetchTvClaims = async () => (Claim.findAll(this.generateQueryParamsWithScope({
    scraperName: {
      [Sequelize.Op.in]: [STATEMENT_SCRAPER_NAMES.CNN_TRANSCRIPT],
    },
  })).then(claims => claims))

  fetchSocialClaims = async () => (Claim.findAll(this.generateQueryParamsWithScope({
    scraperName: STATEMENT_SCRAPER_NAMES.TWITTER_ACCOUNT,
    source: {
      [Sequelize.Op.in]: await getTwitterScreenNamesByListName(TWITTER_LIST_NAMES.NATIONAL),
    },
  })).then(claims => claims))

  getBodyData = async () => ({
    claims: {
      [NEWSLETTER_MEDIA.TV]: await this.fetchTvClaims(),
      [NEWSLETTER_MEDIA.SOCIAL]: await this.fetchSocialClaims(),
    },
  })
}

export default NationalNewsletter
