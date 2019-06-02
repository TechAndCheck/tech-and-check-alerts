import HelloWorldNewsletterQueueFactory from './HelloWorldNewsletterQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

const getQueueFactory = () => new HelloWorldNewsletterQueueFactory()

class HelloWorldNewsletterJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.EVERY_MORNING

  getQueue = () => getQueueFactory().getQueue()
}

export default HelloWorldNewsletterJobScheduler
