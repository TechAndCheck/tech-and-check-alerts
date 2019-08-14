import NationalNewsletterDeliveryQueueFactory from './NationalNewsletterDeliveryQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

const getQueueFactory = () => new NationalNewsletterDeliveryQueueFactory()

class NationalNewsletterDeliveryJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.EVERY_MORNING

  getQueue = () => getQueueFactory().getQueue()
}

export default NationalNewsletterDeliveryJobScheduler
