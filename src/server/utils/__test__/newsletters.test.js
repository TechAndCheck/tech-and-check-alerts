import { hasKey } from '..'
import {
  isInternalMailingList,
} from '../newsletters'
import {
  MAILING_LISTS,
  INTERNAL_MAILING_LISTS,
} from '../../newsletters/constants'

const getInternalMailingList = () => Object.keys(INTERNAL_MAILING_LISTS)[0]

const getExternalMailingList = () => Object.keys(MAILING_LISTS)
  .find(list => !hasKey(INTERNAL_MAILING_LISTS, list))

describe('utils/newsletters', () => {
  describe('#isInternalMailingList', () => {
    const internalMailingList = getInternalMailingList()
    const externalMailingList = getExternalMailingList()
    it('Should recognize internal mailing lists', () => {
      expect(isInternalMailingList(internalMailingList)).toBe(true)
    })
    it('Should reject external mailing lists', () => {
      expect(isInternalMailingList(externalMailingList)).toBe(false)
    })
  })
})
