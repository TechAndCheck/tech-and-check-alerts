import TwitterScrapeInitiationQueueFactory from './TwitterScrapeInitiationQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

class TwitterScrapeInitiationJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.EVERY_HOUR

  getQueueFactory = () => new TwitterScrapeInitiationQueueFactory()
}

export default TwitterScrapeInitiationJobScheduler
