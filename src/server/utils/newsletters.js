import models from '../models'
import config from '../config'
import {
  isProductionEnv,
} from '.'

const { TwitterAccount } = models

/**
 * [description]
 * @param  {[type]} mailingListAddress [description]
 * @return {[type]}                    [description]
 */
export const isTestSafeMailingListAddress = mailingListAddress => config
  .TEST_SAFE_MAILING_LIST_ADDRESSES
  .includes(mailingListAddress)

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
 * @param  {String} list The mailing list address we want to guard
 * @return {String}      The mailing list address we passed in, or a default guarded one
 */
export const guardMailingListAddress = mailingListAddress => (
  (isProductionEnv() || isTestSafeMailingListAddress(mailingListAddress))
    ? mailingListAddress
    : config.TEST_SAFE_MAILING_LIST_ADDRESSES[0] || '')

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
 * Gets the screen names for a given Twitter list.
 *
 * @param  {Number} listId The Twitter list ID we want screen names for
 * @return {Object}        An array of screen names for the list
 */
export const getTwitterScreenNamesByListId = async (listId) => {
  const accounts = await TwitterAccount.getActiveByListId(listId)
  const screenNames = accounts.map(account => account.screenName)
  return screenNames
}
