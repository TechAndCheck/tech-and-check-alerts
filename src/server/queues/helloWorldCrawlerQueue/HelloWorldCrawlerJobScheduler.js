import HelloWorldCrawlerQueueFactory from './HelloWorldCrawlerQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

class HelloWorldCrawlerJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.NONE

  getQueueFactory = () => new HelloWorldCrawlerQueueFactory()
}

export default HelloWorldCrawlerJobScheduler
