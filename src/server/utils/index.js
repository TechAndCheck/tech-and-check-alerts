import fs from 'fs'

import config from '../config'
import { ENV_NAMES } from '../constants'

export const isDevelopmentEnv = () => config.NODE_ENV === ENV_NAMES.DEVELOPMENT
export const isTestEnv = () => config.NODE_ENV === ENV_NAMES.TEST
export const isProductionEnv = () => config.NODE_ENV === ENV_NAMES.PRODUCTION

export const getFileContents = path => fs.readFileSync(path, 'utf8')

export const hasKey = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key)

export const runPromiseSequence = promiseArray => promiseArray.reduce(
  (current, next) => current.then(next),
  Promise.resolve(),
)

export const runSequence = (sequence, seed) => sequence.reduce((param, fn) => fn(param), seed)

export const runAsyncSequence = async (sequence, seed) => sequence.reduce(
  async (promisedParam, fn) => fn(await promisedParam),
  seed,
)

/**
 * Squish a string by replacing all whitespace sequences with a single space.
 *
 * Note that this affects all whitespace, including tabs and newlines.
 *
 * @param  {String} string The string you want to squish
 * @return {String}        The string with all whitespace sequences collapsed to single spaces
 */
export const squish = string => string.replace(/\s+/g, ' ')

/**
 * Validates that the string has non-whitespace content.
 *
 * @param  {String} text The text you are curious about, o curious one
 * @return {Boolean}     True if it has non-whitespace content, else false
 */
export const hasVisibleContent = text => !!text && text.replace(/\s/g, '').length > 0

/**
 * Assigns a common set of properties to all objects in an array.
 *
 * @param  {Array[Object]} arr        The array of objects to be decorated
 * @param  {Object}        properties The properties to be assigned to each object
 * @return {Array[Object]}            The array of decorated objects
 */
export const decorateObjects = (arr, properties) => arr.map(item => Object.assign(item, properties))
