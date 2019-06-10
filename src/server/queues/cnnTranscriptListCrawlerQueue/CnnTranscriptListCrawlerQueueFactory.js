import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class CnnTranscriptListCrawlerQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.crawlerQueues.CNN_TRANSCRIPT_LIST

  getPathToProcessor = () => `${__dirname}/cnnTranscriptListCrawlerJobProcessor.js`
}

export default CnnTranscriptListCrawlerQueueFactory
