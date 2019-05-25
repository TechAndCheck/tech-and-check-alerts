import HelloWorldCrawlerQueueFactory from './HelloWorldCrawlerQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

const getQueueFactory = () => new HelloWorldCrawlerQueueFactory()

class HelloWorldCrawlerJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.EVERY_MINUTE

  getQueue = () => getQueueFactory().getQueue()
}

export default HelloWorldCrawlerJobScheduler
