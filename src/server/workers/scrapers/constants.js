export const STATEMENT_SCRAPERS = {
  CNN_TRANSCRIPT: 'CNN_TRANSCRIPT',
  TWITTER_ACCOUNT: 'TWITTER_ACCOUNT',
}

export const STATEMENT_SCRAPER_NAMES = {
  CNN_TRANSCRIPT: 'cnnTranscript',
  TWITTER_ACCOUNT: 'twitterAccount',
}

/**
 * Maps scrapers to platforms, so that (1) our platform constants don't have to follow the same
 * taxonomy as the scraper constants, and (2) we can link multiple scrapers to a single platform
 * (if we ever want to).
 */
export const STATEMENT_SCRAPER_PLATFORMS = {
  CNN_TRANSCRIPT: 'CNN',
  TWITTER_ACCOUNT: 'TWITTER',
}
