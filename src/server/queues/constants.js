// The timezone that will govern `Schedules` cron schedules
export const QUEUE_SCHEDULER_TIMEZONE = 'America/New_York'

// Times are relative to the `QUEUE_SCHEDULER_TIMEZONE`
export const Schedules = {
  NONE: 'none',
  EVERY_MINUTE: '* * * * *',
  EVERY_HOUR: '0 * * * *',
  EVERY_DAY: '0 0 * * *',
  EVERY_MORNING: '0 8 * * *',
}

export const QueueNames = {
  crawlerQueues: {
    ABSTRACT: 'abstractCrawler',
    CNN_TRANSCRIPT_PORTAL: 'cnnTranscriptPortalCrawler',
    CNN_TRANSCRIPT_LIST: 'cnnTranscriptListCrawler',
    HELLO_WORLD: 'helloWorldCrawler',
  },
  scraperQueues: {
    CNN_TRANSCRIPT_STATEMENT: 'cnnTranscriptStatementScraper',
    TWITTER_ACCOUNT_STATEMENT: 'twitterAccountStatementScraper',
    TWITTER_SCRAPE_INITITATION: 'twitterScrapeInitiation',
    KNOWN_SPEAKER: 'knownSpeakerScraper',
  },
  claimDetectorQueues: {
    CLAIM_BUSTER: 'claimBusterClaimDetector',
  },
  newsletterDeliveryQueues: {
    NATIONAL: 'nationalNewsletterDelivery',
    NORTH_CAROLINA: 'northCarolinaNewsletterDelivery',
  },
}
