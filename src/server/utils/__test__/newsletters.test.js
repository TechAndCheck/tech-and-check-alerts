import {
  isTestSafeMailingListAddress,
  guardMailingListAddress,
} from '../newsletters'
import config from '../../config'

describe('utils/newsletters', () => {
  describe('#isTestSafeMailingListAddress', () => {
    it('Should recognize test safe mailing list addresses', () => {
      const testSafeMailingListAddress = config.TEST_SAFE_MAILING_LIST_ADDRESSES[0]
      expect(isTestSafeMailingListAddress(testSafeMailingListAddress)).toBe(true)
    })
    it('Should reject mailing list addresses that were not explicitly approved', () => {
      expect(isTestSafeMailingListAddress('notAnApprovedTestAddress@example.com')).toBe(false)
    })
  })
  describe('#guardMailingListAddress', () => {
    it('Should allow test safe addresses to pass through unguarded', () => {
      const testSafeMailingListAddress = config.TEST_SAFE_MAILING_LIST_ADDRESSES[0]
      expect(guardMailingListAddress(testSafeMailingListAddress))
        .toEqual(testSafeMailingListAddress)
    })
    it('Should return a test safe address when passed an external list during testing', () => {
      const guardedMailingListAddress = guardMailingListAddress('notAnApprovedTestAddress@example.com')
      expect(config.TEST_SAFE_MAILING_LIST_ADDRESSES).toContain(guardedMailingListAddress)
    })
    /**
     * TODO: It would be nice to be able to simulate the behavior when `isProductionEnv()` was true.
     * Possible solution: https://stackoverflow.com/a/48042799
     */
  })
})
