import Mailer from '../Mailer'

import testData from './mailerTestData'
import config from '../../../config'

const mailer = new Mailer()

describe('Mailer', () => {
  it('Should have mailgun credentials', () => {
    expect(mailer).toHaveProperty('mailgun')
    expect({
      apiKey: mailer.mailgun.apiKey,
      domain: mailer.mailgun.domain,
    }).toEqual({
      apiKey: config.MAILGUN_API_KEY,
      domain: config.MAILGUN_API_DOMAIN,
    })
  })
  it('Should not send without valid message data', () => {
    testData.recipient.invalid.forEach((recipient) => {
      expect(() => mailer.send({
        recipient,
        subject: testData.subject.valid[0],
        body: testData.body.valid[0],
      })).toThrow(Error)
    })
    testData.subject.invalid.forEach((subject) => {
      expect(() => mailer.send({
        recipient: testData.recipient.valid[0],
        subject,
        body: testData.body.valid[0],
      })).toThrow(Error)
    })
    testData.body.invalid.forEach((body) => {
      expect(() => mailer.send({
        recipient: testData.recipient.valid[0],
        subject: testData.subject.valid[0],
        body,
      })).toThrow(Error)
    })
  })
  it('Should send with valid message data', (done) => {
    // This is a pretty weak test. I can't quite marshall Mailgun and mailgun-js to provide a
    // satisfactory simulation of a valid send, so all we're really doing is ensuring it didn't
    // absolutely explode. TODO: Improve this.
    const validSend = () => {
      mailer.send({
        recipient: testData.recipient.valid[0],
        subject: testData.subject.valid[0],
        body: testData.body.valid[0],
      })
      done()
    }
    expect(validSend).not.toThrow(Error)
  })
})
