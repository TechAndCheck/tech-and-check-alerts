import TwitterAccountListScrapeInitiationQueueFactory from './TwitterAccountListScrapeInitiationQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

class TwitterAccountListScrapeInitiationJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.EVERY_DAY

  getQueueFactory = () => new TwitterAccountListScrapeInitiationQueueFactory()
}

export default TwitterAccountListScrapeInitiationJobScheduler
