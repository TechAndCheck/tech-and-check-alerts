import TwitterAccountListScraperQueueFactory from './TwitterAccountListScraperQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

class TwitterAccountListScraperJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.NONE

  getQueueFactory = () => new TwitterAccountListScraperQueueFactory()
}

export default TwitterAccountListScraperJobScheduler
