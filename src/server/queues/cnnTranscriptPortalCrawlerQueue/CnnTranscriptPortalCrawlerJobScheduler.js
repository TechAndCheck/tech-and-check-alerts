import CnnTranscriptPortalCrawlerQueueFactory from './CnnTranscriptPortalCrawlerQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

class CnnTranscriptPortalCrawlerJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.EVERY_MINUTE

  getQueueFactory = () => new CnnTranscriptPortalCrawlerQueueFactory()
}

export default CnnTranscriptPortalCrawlerJobScheduler
