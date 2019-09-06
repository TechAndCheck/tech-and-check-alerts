import NorthCarolinaNewsletterDeliveryQueueFactory from './NorthCarolinaNewsletterDeliveryQueueFactory'
import NorthCarolinaNewsletterDeliveryJobScheduler from './NorthCarolinaNewsletterDeliveryJobScheduler'
import northCarolinaNewsletterDeliveryJobProcessor from './northCarolinaNewsletterDeliveryJobProcessor'

export default {
  factory: new NorthCarolinaNewsletterDeliveryQueueFactory(),
  scheduler: new NorthCarolinaNewsletterDeliveryJobScheduler(),
  processor: northCarolinaNewsletterDeliveryJobProcessor,
}
