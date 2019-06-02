import CnnTranscriptPortalCrawlerQueueFactory from './CnnTranscriptPortalCrawlerQueueFactory'
import CnnTranscriptPortalCrawlerJobScheduler from './CnnTranscriptPortalCrawlerJobScheduler'
import cnnTranscriptPortalCrawlerJobProcessor from './cnnTranscriptPortalCrawlerJobProcessor'

export default {
  factory: new CnnTranscriptPortalCrawlerQueueFactory(),
  scheduler: new CnnTranscriptPortalCrawlerJobScheduler(),
  processor: cnnTranscriptPortalCrawlerJobProcessor,
}
