import NorthCarolinaNewsletterDeliveryQueueFactory from './NorthCarolinaNewsletterDeliveryQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

class NorthCarolinaNewsletterDeliveryJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.EVERY_MORNING

  getQueueFactory = () => new NorthCarolinaNewsletterDeliveryQueueFactory()
}

export default NorthCarolinaNewsletterDeliveryJobScheduler
