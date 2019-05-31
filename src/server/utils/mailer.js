export const isValidEmailAddress = (emailAddress) => {
  const re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
  return re.test(String(emailAddress).toLowerCase())
}

export const isMailSendable = (mail) => {
  const hasValidRecipient = recipient => isValidEmailAddress(recipient)
  const hasValidSubject = subject => subject && typeof subject === 'string'
  const hasValidBody = body => body && typeof body === 'string'

  return (
    hasValidRecipient(mail.recipient)
    && hasValidSubject(mail.subject)
    && hasValidBody(mail.body)
  )
}
