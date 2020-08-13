import NewsletterDeliveryQueueFactory from './NewsletterDeliveryQueueFactory'
import NewsletterDeliveryJobScheduler from './NewsletterDeliveryJobScheduler'
import newsletterDeliveryJobProcessor from './newsletterDeliveryJobProcessor'

export default {
  factory: new NewsletterDeliveryQueueFactory(),
  scheduler: new NewsletterDeliveryJobScheduler(),
  processor: newsletterDeliveryJobProcessor,
}
