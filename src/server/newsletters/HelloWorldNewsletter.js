import { MAILING_LISTS } from '../constants'

import AbstractNewsletter from './AbstractNewsletter'
import models from '../models'

const { Claim } = models

class HelloWorldNewsletter extends AbstractNewsletter {
  getMailingList = () => MAILING_LISTS.DEVELOPERS

  getPathToTemplate = () => `${__dirname}/templates/helloWorld.hbs`

  getSubject = () => 'Hello World: The Newsletter'

  getClaims = () => (Claim.findAll({
    limit: 5,
  }).then(claims => claims))

  getBodyData = async () => ({
    claims: await this.getClaims(),
  })
}

export default HelloWorldNewsletter
