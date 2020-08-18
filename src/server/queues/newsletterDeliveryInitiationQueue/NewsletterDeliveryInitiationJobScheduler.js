import NewsletterDeliveryInitiationQueueFactory from './NewsletterDeliveryInitiationQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

class NewsletterDeliveryInitiationJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.EVERY_MORNING

  getQueueFactory = () => new NewsletterDeliveryInitiationQueueFactory()
}

export default NewsletterDeliveryInitiationJobScheduler
