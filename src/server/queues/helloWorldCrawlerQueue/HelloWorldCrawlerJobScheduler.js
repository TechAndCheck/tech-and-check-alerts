import HelloWorldCrawlerQueueFactory from './HelloWorldCrawlerQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

const getQueueFactory = () => new HelloWorldCrawlerQueueFactory()

class HelloWorldCrawlerJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.NONE

  getQueue = () => getQueueFactory().getQueue()
}

export default HelloWorldCrawlerJobScheduler
