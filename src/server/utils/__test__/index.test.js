import {
  isTestEnv,
  isDevelopmentEnv,
  isProductionEnv,
  squish,
} from '..'

describe('utils/index', () => {
  describe('#isTestEnv', () => {
    it('Should report that we are in the testing environment', () => {
      expect(isTestEnv()).toBe(true)
    })
  })
  describe('#isDevelopmentEnv', () => {
    it('Should report that we are in not in the development environment', () => {
      expect(isDevelopmentEnv()).toBe(false)
    })
  })
  describe('#isProductionEnv', () => {
    it('Should report that we are in not in the production environment', () => {
      expect(isProductionEnv()).toBe(false)
    })
  })
  describe('#squish', () => {
    it('Should replace all whitespace with single spaces', () => {
      expect(squish('Too  much   space.\nAmiright?')).toBe('Too much space. Amiright?')
    })
  })
})
