import CnnTranscriptStatementScraperQueueFactory from './CnnTranscriptStatementScraperQueueFactory'
import CnnTranscriptStatementScraperJobScheduler from './CnnTranscriptStatementScraperJobScheduler'
import cnnTranscriptStatementScraperJobProcessor from './cnnTranscriptStatementScraperJobProcessor'

export default {
  factory: new CnnTranscriptStatementScraperQueueFactory(),
  scheduler: new CnnTranscriptStatementScraperJobScheduler(),
  processor: cnnTranscriptStatementScraperJobProcessor,
}
