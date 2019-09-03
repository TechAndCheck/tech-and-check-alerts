import Sequelize from 'sequelize'
import dayjs from 'dayjs'
import assert from 'assert'

import models from '../models'
import { PLATFORM_NAMES } from '../constants'
import { STATEMENT_SCRAPER_NAMES } from '../workers/scrapers/constants'
import AbstractNewsletter from './AbstractNewsletter'
import {
  NEWSLETTER_SETTINGS,
  MAILING_LISTS,
  NEWSLETTER_MEDIA,
} from './constants'

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

  getScraperNamesByMedium = () => ({
    [NEWSLETTER_MEDIA.TV]: [
      STATEMENT_SCRAPER_NAMES.CNN_TRANSCRIPT,
    ],
    [NEWSLETTER_MEDIA.SOCIAL]: [
      STATEMENT_SCRAPER_NAMES.TWITTER_ACCOUNT,
    ],
  })

  fetchClaimsByMedium = async medium => (Claim.findAll({
    limit: NEWSLETTER_SETTINGS.DEFAULT.CLAIM_LIMIT,
    where: {
      scraperName: {
        [Sequelize.Op.in]: this.getScraperNamesByMedium()[medium],
      },
      createdAt: {
        [Sequelize.Op.gte]: dayjs().startOf('hour').subtract(1, 'day').format(),
        [Sequelize.Op.lt]: dayjs().startOf('hour').format(),
      },
    },
    order: [
      ['claimBusterScore', 'DESC'],
    ],
  }).then(claims => claims))

  getBodyData = async () => ({
    claims: {
      [NEWSLETTER_MEDIA.TV]: await this.fetchClaimsByMedium(NEWSLETTER_MEDIA.TV),
      [NEWSLETTER_MEDIA.SOCIAL]: await this.fetchClaimsByMedium(NEWSLETTER_MEDIA.SOCIAL),
    },
  })
}

export default NationalNewsletter
