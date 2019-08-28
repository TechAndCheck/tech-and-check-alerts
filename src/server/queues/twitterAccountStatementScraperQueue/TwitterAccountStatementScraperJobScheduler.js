import TwitterAccountStatementScraperQueueFactory from './TwitterAccountStatementScraperQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

class TwitterAccountStatementScraperJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.NONE

  getQueueFactory = () => new TwitterAccountStatementScraperQueueFactory()
}

export default TwitterAccountStatementScraperJobScheduler
