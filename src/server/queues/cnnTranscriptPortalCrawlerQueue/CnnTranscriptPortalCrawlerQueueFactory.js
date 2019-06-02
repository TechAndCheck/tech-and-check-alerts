import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class CnnTranscriptPortalCrawlerQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.crawlerQueues.CNN_TRANSCRIPT_PORTAL

  getPathToProcessor = () => `${__dirname}/cnnTranscriptPortalCrawlerJobProcessor.js`
}

export default CnnTranscriptPortalCrawlerQueueFactory
