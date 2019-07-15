import CnnTranscriptStatementScraperQueueFactory from './CnnTranscriptStatementScraperQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

const getQueueFactory = () => new CnnTranscriptStatementScraperQueueFactory()

class CnnTranscriptStatementScraperJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.None

  getQueue = () => getQueueFactory().getQueue()
}

export default CnnTranscriptStatementScraperJobScheduler
