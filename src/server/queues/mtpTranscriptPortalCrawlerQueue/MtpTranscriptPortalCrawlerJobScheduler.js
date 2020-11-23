import MtpTranscriptPortalCrawlerQueueFactory from './MtpTranscriptPortalCrawlerQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

class MtpTranscriptPortalCrawlerJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.EVERY_DAY

  getQueueFactory = () => new MtpTranscriptPortalCrawlerQueueFactory()
}

export default MtpTranscriptPortalCrawlerJobScheduler
