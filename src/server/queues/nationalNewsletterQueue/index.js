import NationalNewsletterQueueFactory from './NationalNewsletterQueueFactory'
import NationalNewsletterJobScheduler from './NationalNewsletterJobScheduler'
import nationalNewsletterJobProcessor from './nationalNewsletterJobProcessor'

export default {
  factory: new NationalNewsletterQueueFactory(),
  scheduler: new NationalNewsletterJobScheduler(),
  processor: nationalNewsletterJobProcessor,
}
