import Sequelize from 'sequelize'
import dayjs from 'dayjs'

import models from '../models'
import AbstractNewsletter from './AbstractNewsletter'
import { MAILING_LISTS } from './constants'

const { Claim } = models

class PrimaryNewsletter extends AbstractNewsletter {
  getMailingList = () => MAILING_LISTS.PRIMARY

  getPathToTemplate = () => `${__dirname}/templates/primary.hbs`

  getPathToTextTemplate = () => `${__dirname}/templates/primaryText.hbs`

  getSubject = () => 'Tech & Check Alerts'

  fetchClaims = () => (Claim.findAll({
    where: {
      createdAt: {
        [Sequelize.Op.gte]: dayjs().subtract(1, 'day').format(),
      },
    },
  }).then(claims => claims))

  getBodyData = async () => ({
    claims: await this.fetchClaims(),
  })
}

export default PrimaryNewsletter
