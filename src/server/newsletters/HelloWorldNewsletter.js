import AbstractNewsletter from './AbstractNewsletter'
import { MAILING_LISTS } from './constants'

class HelloWorldNewsletter extends AbstractNewsletter {
  getMailingList = () => MAILING_LISTS.DEVELOPERS

  getPathToTemplate = () => `${__dirname}/templates/helloWorld.hbs`

  getPathToTextTemplate = () => `${__dirname}/templates/helloWorldText.hbs`

  getSubject = () => 'Tech & Check Hello World'

  assertNewsletterIsSendable = async () => true

  getBodyData = async () => ({})
}

export default HelloWorldNewsletter
