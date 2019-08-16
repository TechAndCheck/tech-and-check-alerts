import NationalNewsletterDeliveryQueueFactory from './NationalNewsletterDeliveryQueueFactory'
import NationalNewsletterDeliveryJobScheduler from './NationalNewsletterDeliveryJobScheduler'
import nationalNewsletterDeliveryJobProcessor from './nationalNewsletterDeliveryJobProcessor'

export default {
  factory: new NationalNewsletterDeliveryQueueFactory(),
  scheduler: new NationalNewsletterDeliveryJobScheduler(),
  processor: nationalNewsletterDeliveryJobProcessor,
}
