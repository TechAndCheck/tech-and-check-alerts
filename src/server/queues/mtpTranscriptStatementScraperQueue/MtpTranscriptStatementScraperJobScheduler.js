import MtpTranscriptStatementScraperQueueFactory from './MtpTranscriptStatementScraperQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

class MtpTranscriptStatementScraperJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.NONE

  getQueueFactory = () => new MtpTranscriptStatementScraperQueueFactory()
}

export default MtpTranscriptStatementScraperJobScheduler
