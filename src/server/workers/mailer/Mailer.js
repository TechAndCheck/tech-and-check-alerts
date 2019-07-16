import Mailgun from 'mailgun-js'

import config from '../../config'
import { isMessageSendable, testModeLogger } from '../../utils/mailer'
import logger from '../../utils/logger'
import { isTestEnv } from '../../utils'
import { MAILER_FROM_ADDRESS } from './constants'

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
      from: MAILER_FROM_ADDRESS,
      to: message.recipient,
      subject: message.subject,
      text: message.body,
    }

    const messageDescription = `"${mailgunData.subject}" from "${mailgunData.from}" to "${mailgunData.to}"`

    return mailgun.messages().send(mailgunData)
      .then(() => {
        logger.info(`Mailgun successfully received ${messageDescription}.`)
      }).catch((error) => {
        logger.warn(`Mailgun failed to send ${messageDescription}. ${error}`)
        return Promise.reject(error)
      })
  }
}

export default Mailer
