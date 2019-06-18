import rp from 'request-promise'

import logger from '../../utils/logger'

class AbstractScraper {
  constructor(scrapeUrl) {
    this.scrapeUrl = scrapeUrl
    logger.info(`Initialized ${this.constructor.name} (${this.scrapeUrl})`)
  }

  /**
   * Process the result of an HTTP request.  The result of the scrape will
   * depend on the nature of the extending class.
   *
   * Each scraper that extends AbstractScraper needs to implement its own
   * scrapeHandler method.
   *
   * @param {String} htmlString The HTML or JSON that came from the HTTP request
   * @return {Object}           Whatever object the scraper is intended to output
   */
  // (this is an abstract method and we need to define its footprint.)
  // eslint-disable-next-line no-unused-vars
  scrapeHandler = (responseString) => {
    throw new Error('You implemented a scraper but forgot to define the scrapeHandler.')
  }

  /**
   * Runs the scraper
   *
   * @return {Promise} A Promise to provide the results of the scrape
   */
  async run() {
    logger.debug(`Getting (${this.scrapeUrl})`)
    return rp(this.scrapeUrl)
      .then((responseString) => {
        logger.debug(`Processing (${this.scrapeUrl})`)
        this.scrapeHandler(responseString)
      })
      .catch((err) => {
        logger.debug(`Errored (${this.scrapeUrl})`)
        logger.error(err)
      })
  }
}

export default AbstractScraper
