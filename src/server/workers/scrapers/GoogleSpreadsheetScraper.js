import AbstractScraper from './AbstractScraper'
import { STATEMENT_SCRAPER_NAMES } from './constants'
import {
  getSpreadsheetCsvUrl,
  parseCsvString,
} from '../../utils/google'

class GoogleSpreadsheetScraper extends AbstractScraper {
  constructor(spreadsheetId) {
    super(getSpreadsheetCsvUrl(spreadsheetId))
  }

  getScraperName = () => STATEMENT_SCRAPER_NAMES.GOOGLE_SPREADSHEET

  scrapeHandler = async responseString => parseCsvString(responseString)
}

export default GoogleSpreadsheetScraper
