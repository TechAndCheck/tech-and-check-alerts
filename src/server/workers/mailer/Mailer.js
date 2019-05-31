import Mailgun from 'mailgun-js'

import config from '../../config'
import { isMailSendable } from '../../utils/mailer'

class Mailer {
  constructor(mail) {
    if (!isMailSendable(mail)) {
      throw new Error('Mailer requires a valid mail object with recipient, subject, and body.')
    }
    this.mail = mail
    this.mailgun = Mailgun({
      apiKey: config.MAILER_API_KEY,
      domain: config.MAILER_API_DOMAIN,
    })
  }

  send = () => {
    const { mailgun, mail } = this
    const mailgunData = {
      from: config.MAILER_FROM_ADDRESS,
      to: mail.recipient,
      subject: mail.subject,
      text: mail.body,
    }
    return mailgun.messages().send(mailgunData, (error, body) => {
      // TODO: Log or notify if things go good or bad.
      if (error) console.log(`Error: ${error}`)
      if (body) console.log(body)
    })
  }
}

export default Mailer
