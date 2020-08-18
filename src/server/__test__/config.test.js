import config from '../config'

describe('config.js', () => {
  describe('TEST_SAFE_MAILING_LIST_ADDRESSES', () => {
    it('should have at least one entry', () => {
      expect(config.TEST_SAFE_MAILING_LIST_ADDRESSES).not.toEqual([''])
    })
  })
})
