import CnnTranscriptListCrawlerQueueFactory from './CnnTranscriptListCrawlerQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

const getQueueFactory = () => new CnnTranscriptListCrawlerQueueFactory()

class CnnTranscriptListCrawlerJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.None

  getQueue = () => getQueueFactory().getQueue()
}

export default CnnTranscriptListCrawlerJobScheduler
