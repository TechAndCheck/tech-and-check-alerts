import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class NationalNewsletterDeliveryQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.newsletterDeliveryQueues.NATIONAL

  getPathToProcessor = () => `${__dirname}/nationalNewsletterDeliveryJobProcessor.js`
}

export default NationalNewsletterDeliveryQueueFactory
