import Sequelize from 'sequelize'
import dayjs from 'dayjs'

import AbstractNewsletter from './AbstractNewsletter'

import models from '../models'

class NationalNewsletter extends AbstractNewsletter {
  // TODO: Get a real mailing list recipient address working, as Mailgun's API complains
  //       about us using testing@sandbox757040a81dda4695bdda931f17664d01.mailgun.org.
  getRecipient = () => 'justin@biffud.com'

  getSubject = () => 'This is the national newsletter'

  // We aren't yet performing newsletter-specific scheduling.
  // getSchedule = () => '0 9 * * *'

  getCollectClaims = () => models.Claim.findAll({
    where: {
      claimedAt: {
        [Sequelize.Op.lt]: dayjs().subtract(1, 'year').format(),
      },
    },
  }).then(claims => claims)
}

export default NationalNewsletter
