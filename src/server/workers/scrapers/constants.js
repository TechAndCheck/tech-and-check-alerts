export const STATEMENT_SCRAPERS = {
  CNN_TRANSCRIPT: 'CNN_TRANSCRIPT',
  MTP_TRANSCRIPT: 'MTP_TRANSCRIPT',
  TWITTER_ACCOUNT: 'TWITTER_ACCOUNT',
}

export const STATEMENT_SCRAPER_NAMES = {
  CNN_TRANSCRIPT: 'cnnTranscript',
  MTP_TRANSCRIPT: 'mtpTranscript',
  TWITTER_ACCOUNT: 'twitterAccount',
}

export const SCRAPER_NAMES = {
  GENERIC: 'generic',
  GOOGLE_SPREADSHEET: 'googleSpreadsheet',
}

/**
 * Maps scrapers to platforms, so that (1) our platform constants don't have to follow the same
 * taxonomy as the scraper constants, and (2) we can link multiple scrapers to a single platform
 * (if we ever want to).
 */
export const STATEMENT_SCRAPER_PLATFORMS = {
  CNN_TRANSCRIPT: 'CNN',
  TWITTER_ACCOUNT: 'TWITTER',
  MTP_TRANSCRIPT: 'MTP',
}

export const SCRAPE_RESPONSE_CODES = {
  NON_HTTP_ERROR: 'non-http-error',
  HTTP_SUCCESS: '200',
}
