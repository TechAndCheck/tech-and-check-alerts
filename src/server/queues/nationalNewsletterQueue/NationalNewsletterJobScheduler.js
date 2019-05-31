import NationalNewsletterQueueFactory from './NationalNewsletterQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

const getQueueFactory = () => new NationalNewsletterQueueFactory()

class NationalNewsletterJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.EVERY_MORNING

  getQueue = () => getQueueFactory().getQueue()
}

export default NationalNewsletterJobScheduler
