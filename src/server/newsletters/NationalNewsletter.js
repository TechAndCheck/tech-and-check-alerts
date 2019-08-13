import Sequelize from 'sequelize'
import dayjs from 'dayjs'
import assert from 'assert'

import models from '../models'
import AbstractNewsletter from './AbstractNewsletter'
import { MAILING_LISTS } from './constants'

const { Claim } = models

class NationalNewsletter extends AbstractNewsletter {
  getMailingList = () => MAILING_LISTS.PRIMARY

  getPathToTemplate = () => `${__dirname}/templates/national.hbs`

  getPathToTextTemplate = () => `${__dirname}/templates/nationalText.hbs`

  getSubject = () => 'Tech & Check Alerts'

  assertNewsletterIsSendable = async () => {
    const bodyData = await this.getCachedBodyData()
    assert(bodyData.tvClaims.length > 0, 'There are claims to share.')
  }

  fetchTVClaims = () => (Claim.findAll({
    limit: 15,
    where: {
      createdAt: {
        [Sequelize.Op.gte]: dayjs().subtract(1, 'day').format(),
      },
    },
    order: [
      ['claimBusterScore', 'DESC'],
    ],
  }).then(tvClaims => tvClaims))

  getBodyData = async () => ({
    tvClaims: await this.fetchTVClaims(),
  })
}

export default NationalNewsletter
