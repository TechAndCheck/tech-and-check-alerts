import {
  MAILING_LIST_ADDRESSES,
  INTERNAL_MAILING_LISTS,
} from '../newsletters/constants'
import { hasKey } from '.'

export const isInternalMailingList = list => hasKey(INTERNAL_MAILING_LISTS, list)

/**
 * Provides the email address for the mailing list associated with the newsletter.
 * Throws an error if there is none, because that makes the newsletter undeliverable
 * and means we've either configured it incorrectly or setup our addresses incorrectly.
 *
 * @return {String} The email address for the associated mailing list
 */
export const getMailingListAddress = (list) => {
  const mailingListAddress = MAILING_LIST_ADDRESSES[list]
  if (!mailingListAddress) throw new Error(`There is no email address associated with the mailing list ${list}.`)
  return mailingListAddress
}
