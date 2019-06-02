import {
  isValidEmailAddress,
  isMessageSendable,
} from '../mailer'

import testData from '../../workers/mailer/__test__/mailerTestData'

describe('utils/mailer', () => {
  describe('#isValidEmailAddress', () => {
    it('Should approve valid emails', () => {
      testData.recipient.valid.forEach((recipient) => {
        expect(isValidEmailAddress(recipient)).toBe(true)
      })
    })
    it('Should reject invalid emails', () => {
      testData.recipient.invalid.forEach((recipient) => {
        expect(isValidEmailAddress(recipient)).toBe(false)
      })
    })
  })
  describe('#isMessageSendable', () => {
    it('Should approve valid message data', () => {
      expect(isMessageSendable({
        recipient: testData.recipient.valid[0],
        subject: testData.subject.valid[0],
        body: testData.body.valid[0],
      })).toBe(true)
    })
    it('Should reject invalid message data', () => {
      testData.recipient.invalid.forEach((recipient) => {
        expect(isMessageSendable({
          recipient,
          subject: testData.subject.valid[0],
          body: testData.body.valid[0],
        })).toBe(false)
      })
      testData.subject.invalid.forEach((subject) => {
        expect(isMessageSendable({
          recipient: testData.recipient.valid[0],
          subject,
          body: testData.body.valid[0],
        })).toBe(false)
      })
      testData.body.invalid.forEach((body) => {
        expect(isMessageSendable({
          recipient: testData.recipient.valid[0],
          subject: testData.subject.valid[0],
          body,
        })).toBe(false)
      })
    })
  })
})
