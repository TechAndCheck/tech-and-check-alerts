import NewsletterDeliveryInitiationQueueFactory from './NewsletterDeliveryInitiationQueueFactory'
import NewsletterDeliveryInitiationJobScheduler from './NewsletterDeliveryInitiationJobScheduler'
import newsletterDeliveryInitiationJobProcessor from './newsletterDeliveryInitiationJobProcessor'

export default {
  factory: new NewsletterDeliveryInitiationQueueFactory(),
  scheduler: new NewsletterDeliveryInitiationJobScheduler(),
  processor: newsletterDeliveryInitiationJobProcessor,
}
