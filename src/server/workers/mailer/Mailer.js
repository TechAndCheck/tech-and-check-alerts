import Mailgun from 'mailgun-js'

import config from '../../config'
import { isMessageSendable, testModeLogger } from '../../utils/mailer'
import logger from '../../utils/logger'
import { isTestEnv } from '../../utils'

class Mailer {
  constructor() {
    this.mailgun = Mailgun({
      apiKey: config.MAILGUN_API_KEY,
      domain: config.MAILGUN_API_DOMAIN,
      testMode: isTestEnv(),
      testModeLogger,
    })
  }

  send = (message) => {
    const { mailgun } = this

    if (!isMessageSendable(message)) {
      throw new Error('Mailer requires a message object with a valid recipient, subject, and body.')
    }

    const mailgunData = {
      from: config.MAILER_FROM_ADDRESS,
      to: message.recipient,
      subject: message.subject,
      text: message.body,
    }

    return mailgun.messages().send(mailgunData).then((response) => {
      if (response) logger.info(response)
    }).catch(error => logger.error(error))
  }
}

export default Mailer
