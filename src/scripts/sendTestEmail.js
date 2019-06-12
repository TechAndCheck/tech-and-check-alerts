import Mailer from '../server/workers/mailer'
import { isValidEmailAddressFormat } from '../server/utils/mailer'

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
  console.error('Pass in a valid recipient email address with the -r flag, e.g. `-r test@test.com`')
  console.error('(The email address must be verified with Mailgun while we are using testing subdomains.)')
  process.exit()
}

const sendTestEmail = () => new Promise(() => {
  const mailer = new Mailer()
  return Promise.resolve(mailer.send({
    recipient,
    subject: 'This is a test email.',
    body: 'This is the body of the email.',
  }))
})
sendTestEmail().then(() => {
  process.exit()
}).catch((error) => {
  console.error(error)
})
