export const Schedules = {
  NONE: 'none',
  EVERY_MINUTE: '* * * * *',
  EVERY_HOUR: '0 * * * *',
  EVERY_DAY: '0 0 * * *',
  EVERY_MORNING: '0 9 * * *',
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
  },
  claimDetectorQueues: {
    CLAIM_BUSTER: 'claimBusterClaimDetector',
  },
  newsletterDeliveryQueues: {
    NATIONAL: 'nationalNewsletterDelivery',
  },
}
