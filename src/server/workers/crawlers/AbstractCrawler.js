import AbstractScraper from '../scrapers/AbstractScraper'

class AbstractCrawler extends AbstractScraper {
  /**
   * Process the result of an HTTP request and identify the URLs
   * to pass into the scraper pipeline.
   *
   * Each crawler that extends AbstractCrawler needs to implement its own
   * crawlHandler method.
   *
   * @param string htmlString The HTML or JSON that came from the HTTP request
   * @return [String] the list of URLs that should be scraped
   */
  // (this is an abstract method and we need to define its footprint.)
  // eslint-disable-next-line no-unused-vars
  crawlHandler = (responseString) => {
    throw new Error('You wrote a new crawler but forgot to define the crawlHandler.')
  }

  scrapeHandler = responseString => this.crawlHandler(responseString)
}

export default AbstractCrawler
