import NationalNewsletterDeliveryQueueFactory from './NationalNewsletterDeliveryQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

class NationalNewsletterDeliveryJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.EVERY_MORNING

  getQueueFactory = () => new NationalNewsletterDeliveryQueueFactory()
}

export default NationalNewsletterDeliveryJobScheduler
