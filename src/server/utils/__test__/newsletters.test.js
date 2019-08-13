import { hasKey } from '..'
import {
  isInternalMailingList,
  getMailingListAddress,
} from '../newsletters'
import {
  MAILING_LISTS,
  INTERNAL_MAILING_LISTS,
} from '../../newsletters/constants'

const getInternalMailingList = () => Object.keys(INTERNAL_MAILING_LISTS)[0]

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
})
