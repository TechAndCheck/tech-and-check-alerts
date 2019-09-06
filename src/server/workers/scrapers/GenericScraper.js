import AbstractScraper from './AbstractScraper'
import { STATEMENT_SCRAPER_NAMES } from './constants'

class GenericScraper extends AbstractScraper {
  getScraperName = () => STATEMENT_SCRAPER_NAMES.GENERIC

  scrapeHandler = async responseString => responseString
}

export default GenericScraper
