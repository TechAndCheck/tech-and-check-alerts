import rp from 'request-promise'
import dayjs from 'dayjs'

import logger from '../../utils/logger'
import models from '../../models'

const { ScrapeLog } = models

class AbstractScraper {
  constructor(scrapeUrl) {
    this.setScrapeUrl(scrapeUrl)
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
  scrapeHandler = async (responseString) => {
    throw new Error('You implemented a scraper but forgot to define the scrapeHandler.')
  }

  /**
   * Return the registered name of this scraper implementation.
   *
   * OVERRIDE WHEN EXTENDING
   *
   * @return {String} The name of the scraper
   */
  getScraperName = () => {
    throw new Error('You implemented a scraper but forgot to define the getScraperName.')
  }

  /**
   * Overrideable method for generating scrape headers.
   *
   * By default this returns null (e.g. no headers), but this allows implementing classes
   * to provide things like authorization headers.
   *
   * @return {Object} The header dict that this scraper is going to pass to the scrape request
   */
  generateScrapeHeaders = async () => null

  /**
   * Helper getter for accessing the current scrape URL.
   *
   * Don't access `scrapeUrl` directly.
   *
   * @return {String} The URL that this scraper is going to scrape
   */
  getScrapeUrl = () => this.scrapeUrl

  /**
   * Helper setter for setting the scrape URL.
   *
   * `scrapeUrl` is meant to be immutable, but JavaScript doesn't support immutability. This
   * setter simulates that by throwing an error if `scrapeUrl` is already defined/truthy.
   * There's nothing stopping someone from changing `scrapeUrl` directly, but hopefully the
   * presence of the method will encourage its use and draw attention to the intended immutability.
   *
   * @param {String} scrapeUrl The URL that this scraper should scrape
   */
  setScrapeUrl = (scrapeUrl) => {
    if (this.scrapeUrl) {
      throw new Error('scrapeUrl is immutable and cannot be redefined.')
    }
    this.scrapeUrl = scrapeUrl
  }

  /**
   * Helper getter for accessing the scrape response.
   *
   * Don't access `scrapeResponse` directly. If JavaScript had private attributes, this would be.
   *
   * @return {String} The response from the last scrape
   */
  getScrapeResponse = () => this.scrapeResponse

  /**
   * Helper setter for storing the scrape response.
   *
   * By storing the scrape response on a class attribute, we make it accessible to all methods
   * within the class, including in many where passing it in as a parameter is impractical.
   *
   * @param {String} scrapeResponse The text result of the scrape
   */
  setScrapeResponse = (scrapeResponse) => { this.scrapeResponse = scrapeResponse }

  /**
   * Look up and return the date of the most recent scrape for this URL
   *
   * @return {Dayjs} The Day.js representation of the scrape time
   */
  getMostRecentScrapeTime = async () => {
    const mostRecentScrape = await ScrapeLog.findOne({
      attributes: ['createdAt'],
      where: {
        scrapeUrl: this.getScrapeUrl(),
        scraperName: this.getScraperName(),
      },
      order: [['createdAt', 'DESC']],
    })

    if (mostRecentScrape == null) return null
    return dayjs(mostRecentScrape.createdAt)
  }

  /**
   * Look up and return the date of the most recent successful scrape for this URL
   *
   * @return {Dayjs} The Day.js representation of the scrape time
   */
  getMostRecentSuccessfulScrapeTime = async () => {
    const mostRecentSuccessfulScrape = await ScrapeLog.findOne({
      attributes: ['createdAt'],
      where: {
        scrapeUrl: this.getScrapeUrl(),
        scraperName: this.getScraperName(),
        error: null,
      },
      order: [['createdAt', 'DESC']],
    })

    if (mostRecentSuccessfulScrape == null) return null
    return dayjs(mostRecentSuccessfulScrape.createdAt)
  }

  /**
   * Generates and saves a scrape log entry
   *
   * @param  {String} result The stringified result of the scrape
   * @param  {String} error  The error message, if any
   * @return {ScrapeLog} the unsaved initial scrape log entry
   */
  createScrapeLog = (result, error) => ScrapeLog.create({
    scrapeUrl: this.getScrapeUrl(),
    scraperName: this.getScraperName(),
    result,
    error,
  })

  /**
   * Runs the scraper
   *
   * @return {Promise} A Promise to provide the results of the scrape
   */
  async run() {
    logger.debug(`Scraping (${this.scrapeUrl})`)
    return rp({
      url: this.scrapeUrl,
      headers: await this.generateScrapeHeaders(),
    })
      .then(async (responseString) => {
        logger.debug(`Success (${this.scrapeUrl})`)
        this.setScrapeResponse(responseString)
        const result = await this.scrapeHandler(responseString)
        this.createScrapeLog(JSON.stringify(result))
        return result
      })
      .catch((err) => {
        logger.debug(`Failed (${this.scrapeUrl}), returning default value.`)
        logger.warn(err)
        this.createScrapeLog(null, err.message)
        return []
      })
  }
}

export default AbstractScraper
