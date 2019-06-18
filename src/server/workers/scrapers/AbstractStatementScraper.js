import AbstractScraper from './AbstractScraper'

class AbstractStatementScraper extends AbstractScraper {
  /**
   * Statement scrapers are designed to extract statements from the
   * scraped page.
   *
   * Each statement scraper that extends AbstractStatementScraper needs to implement
   * its own statementScrapeHandler method.
   *
   * @param {String} responseString The HTML or JSON that came from the HTTP request
   * @return {Object[]}             The list of statements that were scraped
   */
  // (this is an abstract method and we need to define its footprint.)
  // eslint-disable-next-line no-unused-vars
  statementScrapeHandler = (responseString) => {
    throw new Error('You implemented a statement scraper but forgot to define the statementScrapeHandler.')
  }

  scrapeHandler = responseString => this.statementScrapeHandler(responseString)
}

export default AbstractStatementScraper
