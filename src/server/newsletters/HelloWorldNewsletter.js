import models from '../models'
import AbstractNewsletter from './AbstractNewsletter'
import { MAILING_LISTS } from './constants'

const { Claim, Speaker } = models

class HelloWorldNewsletter extends AbstractNewsletter {
  getMailingList = () => MAILING_LISTS.DEVELOPERS

  getPathToTemplate = () => `${__dirname}/templates/helloWorld.hbs`

  getSubject = () => 'Hello World: The Newsletter'

  getClaims = () => (Claim.findAll({
    limit: 5,
    include: [{
      model: Speaker,
      as: 'speaker',
    }],
  }).then(claims => claims))

  getBodyData = async () => ({
    claims: await this.getClaims(),
  })
}

export default HelloWorldNewsletter
