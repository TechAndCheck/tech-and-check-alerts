import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class CnnTranscriptStatementScraperQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.scraperQueues.CNN_TRANSCRIPT_STATEMENT

  getPathToProcessor = () => `${__dirname}/cnnTranscriptStatementScraperJobProcessor.js`
}

export default CnnTranscriptStatementScraperQueueFactory
