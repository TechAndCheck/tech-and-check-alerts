import NewsletterDeliveryQueueFactory from './NewsletterDeliveryQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

class NewsletterDeliveryJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.NONE

  getQueueFactory = () => new NewsletterDeliveryQueueFactory()
}

export default NewsletterDeliveryJobScheduler
