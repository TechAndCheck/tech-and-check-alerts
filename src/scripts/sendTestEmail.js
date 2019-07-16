import Mailer from '../server/workers/mailer'
import { isValidEmailAddressFormat } from '../server/utils/mailer'
import logger from '../server/utils/logger'

const getRecipient = () => {
  const recipientFlag = process.argv.indexOf('-r')
  if (recipientFlag !== -1) {
    const recipient = process.argv[recipientFlag + 1]
    if (isValidEmailAddressFormat(recipient)) return recipient
  }
  return null
}

const recipient = getRecipient()
if (!recipient) {
  logger.error('Pass in a valid email address with the `-r` parameter.')
  process.exit()
}

const sendTestEmail = () => new Promise(() => {
  const mailer = new Mailer()
  return mailer.send({
    recipient,
    subject: 'This is a test email.',
    body: 'This is the body of the email.',
  })
})
sendTestEmail().catch((error) => {
  logger.error(`Did not send the test email. ${error}`)
}).then(() => {
  process.exit()
})
