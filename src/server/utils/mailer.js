export const isValidEmailAddressFormat = (emailAddress) => {
  const re = /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/
  return re.test(String(emailAddress).toLowerCase())
}

export const isMessageSendable = (mail) => {
  const hasValidRecipient = recipient => isValidEmailAddressFormat(recipient)
  const hasValidSubject = subject => !!subject && typeof subject === 'string'
  const hasValidBody = body => !!body && typeof body === 'string'

  return (
    hasValidRecipient(mail.recipient)
    && hasValidSubject(mail.subject)
    && hasValidBody(mail.body)
  )
}


/**
 * The `mailgun-js` package lets you configure it to run in "test mode", which simulates but does
 * not complete Mailgun API interactions. When this mode is enabled, however, mailgun-js runs a
 * noisy logger that logs a bunch of stuff to the console. Since we enable test mode when NODE_ENV
 * reports we're testing, this pollutes our test results with a bunch of unnecessary logging. So,
 * we create a logger that returns a bunch of useful data but doesn't actually log.
 *
 * @return {object} Returns some structured request details, although we do nothing with it.
 */
export const testModeLogger = (httpOptions, payload, form) => {
  const { method, path } = httpOptions
  const hasPayload = !!payload
  const hasForm = !!form
  return {
    method, path, hasPayload, hasForm,
  }
}
