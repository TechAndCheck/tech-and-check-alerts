import querystring from 'querystring'

import { hasVisibleContent } from '.'
import models from '../models'

const { TwitterAccount } = models

export const isTwitterScreenName = screenName => /^@?(\w){1,15}$/.test(screenName)

export const getTwitterApiUrlForUserTimeline = (screenName) => {
  const params = {
    screen_name: screenName,
    include_rts: false,
    tweet_mode: 'extended',
  }
  return `https://api.twitter.com/1.1/statuses/user_timeline.json?${querystring.stringify(params)}`
}

export const parseJsonIntoTweets = input => JSON.parse(input)

export const getCanonicalUrlFromTweet = tweet => `https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`

export const getSpeakerNameFromTweet = tweet => tweet.user.name

export const getSourceFromTweet = tweet => tweet.user.screen_name

export const getTextFromTweet = tweet => tweet.full_text

export const getSpeakerAffiliationFromTweet = tweet => tweet.user.description

export const getTimestampFromTweet = tweet => tweet.created_at

export const extractStatementsFromTweets = tweets => tweets.map(tweet => ({
  speaker: {
    extractedName: getSpeakerNameFromTweet(tweet),
    normalizedName: getSpeakerNameFromTweet(tweet),
    affiliation: getSpeakerAffiliationFromTweet(tweet),
  },
  text: getTextFromTweet(tweet),
  source: getSourceFromTweet(tweet),
  canonicalUrl: getCanonicalUrlFromTweet(tweet),
  claimedAt: getTimestampFromTweet(tweet),
}))

/**
 * Converts a screen name to a form that can reliably be used as a dict key.
 *
 * @param  {String} screenName The screen name you want to hash
 * @return {String}            The screen name hash
 */
export const getScreenNameHash = screenName => screenName.toLowerCase()

/**
 * Returns the better of two name options.
 *
 * For Twitter, the `a` name will be the name scraped from the API, while the `b` name will be the
 * name we've stored as "preferred" for that account. We don't do any fancy heuristics here,
 * trusting in human intent. All we really do is make sure the preferred name isn't empty.
 *
 * @param  {String} a The default name
 * @param  {String} b The candidate name for improvement
 * @return {String}    The best name
 */
export const getBestName = (a, b) => (
  hasVisibleContent(b) ? b : a
)

/**
 * Given an array of statements, returns an array of screen names.
 *
 * @param  {Array<Statement>} statements An array of statements from which to pluck the screen name
 * @return {Array<String>}               An array of screen names
 */
export const getScreenNamesFromStatements = statements => statements
  .map(statement => statement.source)

/**
 * An accumulator function used by `reduce()` to extract an account's preferred display name and
 * add it to the accumulator.
 *
 * @param  {Object}         displayNamesByScreenName A dict of display names keyed by screen name
 * @param  {TwitterAccount} account                  The Twitter account we're adding to the dict
 * @return {Object}                                  The dict, with the account added
 */
const applyDisplayNameToDict = (displayNamesByScreenName, account) => {
  const {
    screenName,
    preferredDisplayName,
  } = account
  return Object.assign({}, displayNamesByScreenName, {
    [getScreenNameHash(screenName)]: preferredDisplayName,
  })
}

/**
 * Given an array of screen names, looks up the preferred display names from the database and
 * returns a dict mapping screen names to display name.
 *
 * Note that (1) this requires calling the database so it is an async functionm and (2) the dict
 * that this returns uses screen name hashes as keys, so be sure to hash screen names through
 * `getScreenNameHash()` when accessing the dict values that this function returns.
 *
 * @param  {Array<String>} screenNames An array of screen names
 * @return {Promise<Object>}           When the Promise resolves, returns a dict mapping screen
 *                                     names to display names
 */
export const getDisplayNamesForScreenNames = async screenNames => TwitterAccount
  .getByScreenNames(screenNames)
  .then(accounts => accounts.reduce(applyDisplayNameToDict, {}))

/**
 * Modifies the given statement with a normalized speaker name, using a collection of preferred
 * display names (keyed by screen name).
 *
 * This function requires the entire statement as input since it relies on `statement.source` for
 * display name lookup.
 *
 * Design caveat: Arguably, it could receive a statement but only return a speaker, but that
 * version felt unintuitive and less legible than a statement in / statement out design.
 *
 * @param  {Statement} statement                The statement to apply a display name to
 * @param  {Object}    displayNamesByScreenName A dict of display names keyed by screen name
 * @return {Object}                             The statement, with speaker name normalized
 */
export const normalizeStatementSpeaker = (statement, displayNamesByScreenName) => {
  const {
    source,
    speaker,
    speaker: {
      extractedName: speakerName,
    },
  } = statement
  const preferredDisplayName = displayNamesByScreenName[getScreenNameHash(source)]
  const normalizedSpeakerName = getBestName(speakerName, preferredDisplayName)
  return Object.assign({}, statement, {
    speaker: {
      ...speaker,
      normalizedName: normalizedSpeakerName,
    },
  })
}

/**
 * Given a list of statements, normalizes the speaker names for all the statements.
 *
 * In practice, this means looking up our preferred display names for each associated Twitter
 * account from the database and applying them to each statement speaker.
 *
 * We want to await the database lookup, so this function is marked async.
 *
 * @param  {Array<Statement>} statements An array of statements whose speakers should be normalized
 * @return {Promise<Array>}              A Promise that, when resolved, returns the array of
 *                                       statements with normalized speaker names
 */
export const normalizeStatementSpeakers = async (statements) => {
  const screenNames = getScreenNamesFromStatements(statements)
  const displayNamesByScreenName = await getDisplayNamesForScreenNames(screenNames)
  return statements
    .map(statement => normalizeStatementSpeaker(statement, displayNamesByScreenName))
}
