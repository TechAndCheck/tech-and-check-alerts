import rp from 'request-promise'

import logger from '../../utils/logger'
import redisClient from '../../redis/client'
import {
  parseTime,
  parseTimes,
} from '../../utils/redis'

class AbstractScraper {
  constructor(scrapeUrl) {
    this.scrapeUrl = scrapeUrl
  }

  /**
   * Process the result of an HTTP request.  The result of the scrape will
   * depend on the nature of the extending class.
   *
   * Each scraper that extends AbstractScraper needs to implement its own
   * scrapeHandler method.
   *
   * OVERRIDE WHEN EXTENDING

   * @param {String} htmlString The HTML or JSON that came from the HTTP request
   * @return {Object}           Whatever object the scraper is intended to output
   */
  // (this is an abstract method and we need to define its footprint.)
  // eslint-disable-next-line no-unused-vars
  scrapeHandler = (responseString) => {
    throw new Error('You implemented a scraper but forgot to define the scrapeHandler.')
  }

  /**
   * Return the registered name of this scraper implementation.
   *
   * OVERRIDE WHEN EXTENDING
   *
   * @return {String} The name of the scraper
   */
  getScraperName = () => throw new Error('You implemented a scraper but forgot to define the getScraperName.')

  /**
   * Helper getter for accessing the current scrape URL.
   *
   * The programmer could access this directly, but ultimately we don't want them to have
   * to know about naming conventions for internal attributes (the scrapeUrl ought to be "private"
   * but javascript doesn't)
   *
   * @return {String} The url that this scraper is going to scrape
   */
  getScrapeUrl = () => this.scrapeUrl

  /**
   * Register this as the most recent successful scrape in redis.
   *
   * @return {null}
   */
  registerScrapeSuccess = () => {
    const timestamp = Date.now()
    redisClient.lpush(
      this.getRedisKeys().successTimes,
      timestamp,
    )
    redisClient.set(
      this.getRedisKeys().latestAttemptAt,
      timestamp,
    )
  }

  /**
   * Register this as the most recent errored scrape in redis.
   *
   * @return {null}
   */
  registerScrapeError = () => {
    const timestamp = Date.now()
    redisClient.lpush(
      this.getRedisKeys().failureTimes,
      timestamp,
    )
    redisClient.set(
      this.getRedisKeys().latestAttemptAt,
      timestamp,
    )
  }

  /**
   * Store the scrape results.
   *
   * @return {null}
   */
  storeScrapeResult = result => redisClient.lpush(
    this.getRedisKeys().results,
    JSON.stringify(result),
  )

  /**
   * Store the scrape error.
   *
   * @return {null}
   */
  storeScrapeError = error => redisClient.lpush(
    this.getRedisKeys().errors,
    error.message,
  )

  /**
   * Look up and return the date of the most recent scrape for this URL
   *
   * @return {DayJS} The dayJS representation of the scrape time
   */
  getMostRecentScrapeTime = async () => {
    const timestamp = await redisClient.getAsync(this.getRedisKeys().latestAttemptAt)
    return parseTime(timestamp)
  }

  /**
   * Look up and return the date of the most recent successful scrape for this URL
   *
   * @return {DayJS} The dayJS representation of the scrape time
   */
  getMostRecentSuccessfulScrapeTime = async () => {
    const timestamps = await redisClient.lrangeAsync(this.getRedisKeys().successTimes, 0, 1)
    const times = parseTimes(timestamps)
    return times.length > 0 ? times[0] : null
  }

  /**
   * Runs the scraper
   *
   * @return {Promise} A Promise to provide the results of the scrape
   */
  async run() {
    logger.debug(`Scraping (${this.scrapeUrl})`)
    return rp(this.scrapeUrl)
      .then((responseString) => {
        logger.debug(`Success (${this.scrapeUrl})`)
        const result = this.scrapeHandler(responseString)
        this.registerScrapeSuccess()
        this.storeScrapeResult(result)
        return result
      })
      .catch((err) => {
        logger.debug(`Failed (${this.scrapeUrl}), returning default value.`)
        logger.warn(err)
        this.registerScrapeError()
        this.storeScrapeError(err)
        return []
      })
  }
}

export default AbstractScraper
