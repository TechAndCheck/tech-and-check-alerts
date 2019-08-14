import { hasKey } from '..'
import {
  isInternalMailingList,
  getMailingListAddress,
  guardMailingList,
} from '../newsletters'
import {
  GUARDED_MAILING_LIST,
  MAILING_LISTS,
  INTERNAL_MAILING_LISTS,
} from '../../newsletters/constants'

const getInternalMailingList = () => Object.keys(INTERNAL_MAILING_LISTS)[0]

/**
 * This essentially exists because the guarded list is on the internal mailing list array, so we
 * can't accurately test guardMailingList() without choosing a different one.
 */
const getUnguardedInternalMailingList = () => Object.keys(MAILING_LISTS)
  .find(list => list !== GUARDED_MAILING_LIST)

const getExternalMailingList = () => Object.keys(MAILING_LISTS)
  .find(list => !hasKey(INTERNAL_MAILING_LISTS, list))

describe('utils/newsletters', () => {
  const internalMailingList = getInternalMailingList()
  const externalMailingList = getExternalMailingList()
  describe('#isInternalMailingList', () => {
    it('Should recognize internal mailing lists', () => {
      expect(isInternalMailingList(internalMailingList)).toBe(true)
    })
    it('Should reject external mailing lists', () => {
      expect(isInternalMailingList(externalMailingList)).toBe(false)
    })
  })
  describe('#getMailingListAddress', () => {
    it('Should return email addressess for valid mailing lists', () => {
      expect(getMailingListAddress(internalMailingList)).toContain('@')
      expect(getMailingListAddress(externalMailingList)).toContain('@')
    })
    it('Should throw an error when passed an invalid mailing list', () => {
      expect(() => {
        getMailingListAddress('FAKE')
      }).toThrowError()
    })
  })
  describe('#guardMailingList', () => {
    it('Should allow internal lists to pass through unguarded', () => {
      const unguardedInternalMailingList = getUnguardedInternalMailingList()
      expect(guardMailingList(unguardedInternalMailingList)).toEqual(unguardedInternalMailingList)
    })
    it('Should return the guarded list when passed an external list, here in testing', () => {
      expect(guardMailingList(getExternalMailingList)).toEqual(GUARDED_MAILING_LIST)
    })
    /**
     * TODO: It would be nice to be able to simulate the behavior when `isProductionEnv()` was true.
     * Possible solution: https://stackoverflow.com/a/48042799
     */
  })
})
