import Sequelize from 'sequelize'
import dayjs from 'dayjs'
import assert from 'assert'

import models from '../models'
import {
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

class NorthCarolinaNewsletter extends AbstractNewsletter {
  getMailingList = () => MAILING_LISTS.NORTH_CAROLINA

  getPathToTemplate = () => `${__dirname}/templates/northCarolina.hbs`

  getPathToTextTemplate = () => `${__dirname}/templates/northCarolinaText.hbs`

  getSubject = () => `Tech & Check Alerts: NC Politics ${dayjs().format('MM/DD/YY')}`

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
      createdAt: {
        [Sequelize.Op.gte]: dayjs().startOf('hour').subtract(1, 'day').format(),
        [Sequelize.Op.lt]: dayjs().startOf('hour').format(),
      },
    },
    limit: NEWSLETTER_SETTINGS.NORTH_CAROLINA.CLAIM_LIMIT,
    order: [['claimBusterScore', 'DESC']],
  })

  fetchSocialClaims = async () => (Claim.findAll(this.generateQueryParams({
    scraperName: STATEMENT_SCRAPER_NAMES.TWITTER_ACCOUNT,
    source: {
      [Sequelize.Op.in]: await getTwitterScreenNamesByListName(TWITTER_LIST_NAMES.NORTH_CAROLINA),
    },
  })))

  getBodyData = async () => ({
    claims: {
      [NEWSLETTER_MEDIA.SOCIAL]: await this.fetchSocialClaims(),
    },
  })
}

export default NorthCarolinaNewsletter
