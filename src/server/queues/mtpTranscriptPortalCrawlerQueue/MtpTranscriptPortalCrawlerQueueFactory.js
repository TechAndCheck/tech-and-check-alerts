import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class MtpTranscriptPortalCrawlerQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.crawlerQueues.MTP_TRANSCRIPT_PORTAL

  getPathToProcessor = () => `${__dirname}/mtpTranscriptPortalCrawlerJobProcessor.js`
}

export default MtpTranscriptPortalCrawlerQueueFactory
