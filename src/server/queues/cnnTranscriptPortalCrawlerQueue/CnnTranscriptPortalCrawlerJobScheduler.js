import CnnTranscriptPortalCrawlerQueueFactory from './CnnTranscriptPortalCrawlerQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

const getQueueFactory = () => new CnnTranscriptPortalCrawlerQueueFactory()

class CnnTranscriptPortalCrawlerJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.EVERY_MINUTE

  getQueue = () => getQueueFactory().getQueue()
}

export default CnnTranscriptPortalCrawlerJobScheduler
