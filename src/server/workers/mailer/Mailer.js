import Mailgun from 'mailgun-js'

import config from '../../config'
import { isMessageSendable, testModeLogger } from '../../utils/mailer'

class Mailer {
  constructor() {
    this.mailgun = Mailgun({
      apiKey: config.MAILER_API_KEY,
      domain: config.MAILER_API_DOMAIN,
      testMode: config.NODE_ENV === 'test',
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

    return mailgun.messages().send(mailgunData, (error, body) => {
      // TODO: Log (#34) or notify (#35) if things go good or bad.
      if (error) console.log(`Error: ${error}`)
      if (body) console.log(body)
    })
  }
}

export default Mailer
