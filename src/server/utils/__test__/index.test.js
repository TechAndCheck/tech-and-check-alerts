import {
  decorateObjects,
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
  describe('#decorateObjects', () => {
    it('Should assign the new values to all objects', () => {
      const originalObjects = [
        { a: 1, b: 2 },
        { a: 3, b: 4 },
      ]
      const decorator = {
        c: 5,
      }
      const modifiedObjects = decorateObjects(originalObjects, decorator)
      expect(modifiedObjects).toHaveLength(2)
      expect(modifiedObjects[0]).toHaveProperty('c')
      expect(modifiedObjects[0].c).toEqual(5)
      expect(modifiedObjects[1]).toHaveProperty('c')
      expect(modifiedObjects[1].c).toEqual(5)
    })
  })
})
