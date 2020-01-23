import AbstractScraper from './AbstractScraper'
import { STATEMENT_SCRAPER_NAMES } from './constants'
import {
  getSpreadsheetCsvUrl,
  parseCsvString,
} from '../../utils/google'

class GoogleSpreadsheetScraper extends AbstractScraper {
  constructor(spreadsheetId, columnHeaders = false) {
    super(getSpreadsheetCsvUrl(spreadsheetId))
    this.columnHeaders = columnHeaders
  }

  getScraperName = () => STATEMENT_SCRAPER_NAMES.GOOGLE_SPREADSHEET

  scrapeHandler = async responseString => parseCsvString(responseString, this.columnHeaders)
}

export default GoogleSpreadsheetScraper
