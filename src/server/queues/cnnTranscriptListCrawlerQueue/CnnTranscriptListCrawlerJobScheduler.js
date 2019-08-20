import CnnTranscriptListCrawlerQueueFactory from './CnnTranscriptListCrawlerQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

class CnnTranscriptListCrawlerJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.NONE

  getQueueFactory = () => new CnnTranscriptListCrawlerQueueFactory()
}

export default CnnTranscriptListCrawlerJobScheduler
