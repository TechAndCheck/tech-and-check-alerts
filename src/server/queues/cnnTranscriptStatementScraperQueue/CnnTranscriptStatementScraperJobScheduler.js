import CnnTranscriptStatementScraperQueueFactory from './CnnTranscriptStatementScraperQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

class CnnTranscriptStatementScraperJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.NONE

  getQueueFactory = () => new CnnTranscriptStatementScraperQueueFactory()
}

export default CnnTranscriptStatementScraperJobScheduler
