import { MAILING_LISTS } from '../constants'

import AbstractNewsletter from './AbstractNewsletter'
import models from '../models'

class HelloWorldNewsletter extends AbstractNewsletter {
  getMailingList = () => MAILING_LISTS.DEVELOPERS

  getPathToTemplate = () => `${__dirname}/templates/helloWorld.hbs`

  getSubject = () => 'Hello World: The Newsletter'

  getBodyData = async () => {
    const claims = await models.Claim.findAll({
      limit: 5,
    }).then(c => c)
    return {
      claims,
    }
  }
}

export default HelloWorldNewsletter
