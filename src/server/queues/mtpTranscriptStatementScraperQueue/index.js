import MtpTranscriptStatementScraperQueueFactory from './MtpTranscriptStatementScraperQueueFactory'
import MtpTranscriptStatementScraperJobScheduler from './MtpTranscriptStatementScraperJobScheduler'
import mtpTranscriptStatementScraperJobProcessor from './mtpTranscriptStatementScraperJobProcessor'

export default {
  factory: new MtpTranscriptStatementScraperQueueFactory(),
  scheduler: new MtpTranscriptStatementScraperJobScheduler(),
  processor: mtpTranscriptStatementScraperJobProcessor,
}
