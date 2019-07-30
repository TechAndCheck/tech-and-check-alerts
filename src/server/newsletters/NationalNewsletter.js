import Sequelize from 'sequelize'
import dayjs from 'dayjs'

import models from '../models'
import AbstractNewsletter from './AbstractNewsletter'
import { MAILING_LISTS } from './constants'

const { Claim, Speaker } = models

class NationalNewsletter extends AbstractNewsletter {
  getMailingList = () => MAILING_LISTS.PRIMARY

  getPathToTemplate = () => `${__dirname}/templates/national.hbs`

  getPathToTextTemplate = () => `${__dirname}/templates/nationalText.hbs`

  getSubject = () => 'Tech & Check Alerts'

  getIsNewsletterSendable = async () => {
    const bodyData = await this.getCachedBodyData()
    return bodyData.tvClaims.length > 0
  }

  fetchTVClaims = () => (Claim.findAll({
    limit: 10,
    where: {
      createdAt: {
        [Sequelize.Op.gte]: dayjs().subtract(1, 'day').format(),
      },
    },
    order: [
      ['claimBusterScore', 'DESC'],
    ],
    include: [{
      model: Speaker,
      as: 'speaker',
    }],
  }).then(tvClaims => tvClaims))

  getBodyData = async () => ({
    tvClaims: await this.fetchTVClaims(),
  })
}

export default NationalNewsletter
