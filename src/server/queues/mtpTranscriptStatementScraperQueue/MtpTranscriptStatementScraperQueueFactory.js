import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class MtpTranscriptStatementScraperQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.scraperQueues.MTP_TRANSCRIPT_STATEMENT

  getPathToProcessor = () => `${__dirname}/mtpTranscriptStatementScraperJobProcessor.js`
}

export default MtpTranscriptStatementScraperQueueFactory
