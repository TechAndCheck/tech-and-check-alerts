import AbstractNewsletter from './AbstractNewsletter'
import { MAILING_LISTS } from './constants'

class HelloWorldNewsletter extends AbstractNewsletter {
  getMailingList = () => MAILING_LISTS.DEVELOPERS

  getPathToTemplate = () => `${__dirname}/templates/helloWorld.hbs`

  getPathToTextTemplate = () => `${__dirname}/templates/helloWorldText.hbs`

  getSubject = () => '[DEV] Tech & Check Hello World'

  getIsNewsletterSendable = async () => true

  getBodyData = async () => ({})
}

export default HelloWorldNewsletter
