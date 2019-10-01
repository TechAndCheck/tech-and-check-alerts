import models from '../models'
import {
  GUARDED_MAILING_LIST,
  MAILING_LIST_ADDRESSES,
  INTERNAL_MAILING_LISTS,
} from '../newsletters/constants'
import {
  isProductionEnv,
  hasKey,
} from '.'

const { TwitterAccount } = models

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

/**
 * Protects us from accidentally sending newsletters to production recipients.
 *
 * We configure newsletters with an associated mailing list. However, in development/testing, we
 * want to send these newsletters only to internal mailing lists. Rather than have to reconfigure
 * newsletters constantly while testing, we simply pass the configured mailing list through this
 * guard function when determining the recipient. If we're in production mode, or if the newsletter
 * is configured to send to an internal list anyway, we allow the configured mailing list to
 * determine the recipeint. Otherwise, we default to the GUARDED_MAILING_LIST constant (currently
 * the developers list).
 *
 * @param  {String} list The mailing list we want to guard
 * @return {String}      The mailing list we passed in, or the default guarded one
 */
export const guardMailingList = list => ((isProductionEnv() || isInternalMailingList(list))
  ? list
  : GUARDED_MAILING_LIST)

/**
 * Gets the screen names for a given Twitter list.
 *
 * @param  {String} listName The Twitter list we want screen names for
 * @return {Array}           The screen names for that list
 */
export const getTwitterScreenNamesByListName = async listName => (
  TwitterAccount.getActiveByListName(listName)
    .then(accounts => accounts.map(account => account.screenName))
)

/**
 * Gets the screen names for a given array of Twitter lists.
 *
 * @param  {Array<String>} listNames The Twitter lists we want screen names for
 * @return {Object}                  An array of screen names for each list, organized into an
 *                                   object keyed by list name
 */
export const getTwitterScreenNamesByListNames = async listNames => (
  TwitterAccount.getActiveByListNames(listNames)
    .then(accounts => accounts.reduce((lists, account) => {
      if (hasKey(lists, account.listName)) {
        lists[account.listName].push(account.screenName)
      } else {
        // eslint-disable-next-line no-param-reassign
        lists[account.listName] = [account.screenName]
      }
      return lists
    }, {}))
)
