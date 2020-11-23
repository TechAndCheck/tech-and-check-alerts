import MtpTranscriptPortalCrawlerQueueFactory from './MtpTranscriptPortalCrawlerQueueFactory'
import MtpTranscriptPortalCrawlerJobScheduler from './MtpTranscriptPortalCrawlerJobScheduler'
import mtpTranscriptPortalCrawlerJobProcessor from './mtpTranscriptPortalCrawlerJobProcessor'

export default {
  factory: new MtpTranscriptPortalCrawlerQueueFactory(),
  scheduler: new MtpTranscriptPortalCrawlerJobScheduler(),
  processor: mtpTranscriptPortalCrawlerJobProcessor,
}
