import AbstractNewsletter from './AbstractNewsletter'
import { TEMPLATES } from './constants'

import models from '../models'

class HelloWorldNewsletter extends AbstractNewsletter {
  getTemplate = () => TEMPLATES.HELLO_WORLD

  // TODO: Get a real mailing list recipient address working, as Mailgun's API complains
  //       about us using testing@sandbox757040a81dda4695bdda931f17664d01.mailgun.org.
  getRecipient = () => 'justin@biffud.com'

  getSubject = () => 'Hello World: The Newsletter'

  // We aren't yet performing newsletter-specific scheduling.
  // getSchedule = () => '0 9 * * *'

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
