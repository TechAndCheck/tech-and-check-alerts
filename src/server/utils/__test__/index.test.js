import {
  isTestEnv,
  isDevelopmentEnv,
  isProductionEnv,
  squish,
  hasVisibleContent,
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
  describe('#hasVisibleContent', () => {
    it('Should accept strings with non-whitespace content', () => {
      expect(hasVisibleContent('Hello')).toBe(true)
      expect(hasVisibleContent(' Hello ')).toBe(true)
    })
    it('Should reject strings without non-whitespace content', () => {
      expect(hasVisibleContent()).toBe(false)
      expect(hasVisibleContent('')).toBe(false)
      expect(hasVisibleContent(' ')).toBe(false)
    })
  })
})
