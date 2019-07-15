import dayjs from 'dayjs'
import { promisify } from 'util'

/**
 * Returns a version of the redis client with promise based
 * versions of key methods.
 *
 * @param  {Object} client The redis client that came from the redis client factory
 * @return {Object}        The redis client with promise based methods
 */
export const promisifyClient = (client) => {
  const methods = [
    'get', // => `getAsync`
    'lrange', // => `getAsync`
  ] // The list of redux methods we want to promisify

  return methods.reduce((oldClient, method) => {
    const newClient = oldClient
    newClient[`${method}Async`] = promisify(oldClient[method])
    return newClient
  }, client)
}

/**
 * The timestamp we want to convert to a DayJS object.
 * Returns null on an invalid format
 *
 * @param  {String} value The string we want to parse
 * @return {DayJS}        The resulting DayJS object
 */
export const parseTime = (value) => {
  if (value) {
    const time = dayjs(parseInt(value, 10))
    if (time.isValid()) {
      return time
    }
  }
  return null
}

/**
 * Takes a list of timestamps and runs each through parseTime.
 *
 * @param  {String[]} values The string timestamps to convert
 * @return {DayJS[]}         The DayJS versions of each object
 */
export const parseTimes = values => values.map(parseTime)
