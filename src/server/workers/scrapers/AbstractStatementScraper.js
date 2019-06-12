import rp from 'request-promise'

import logger from '../../utils/logger'

class AbstractStatementScraper {
  constructor(scrapeUrl) {
    this.scrapeUrl = scrapeUrl
  }

  /**
   * Process the result of an HTTP request and identify the urls
   * to pass into the scraper pipeline.
   *
   * Each scraper that extends AbstractStatementScraper needs to implement its own
   * scrapeHandler method.
   *
   * @param {String} htmlString The HTML or JSON that came from the HTTP request
   * @return {Object[]}         the list of statements that were scraped
   */
  // (this is an abstract method and we need to define its footprint.)
  // eslint-disable-next-line no-unused-vars
  scrapeHandler = (responseString) => {
    throw new Error('You implemented a statement scraper but forgot to define the scrapeHandler.')
  }

  /**
   * Runs the crawler
   *
   * @return {Promise} a Promise to provide a list of URLs that came fromthe crawl handler
   */
  async run() {
    return rp(this.scrapeUrl)
      .then(this.scrapeHandler)
      .catch((err) => {
        logger.error(err)
      })
  }
}

export default AbstractStatementScraper
