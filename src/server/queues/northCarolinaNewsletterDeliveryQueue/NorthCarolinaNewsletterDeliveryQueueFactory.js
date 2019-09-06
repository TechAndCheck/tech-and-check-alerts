import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class NorthCarolinaNewsletterDeliveryQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.newsletterDeliveryQueues.NATIONAL

  getPathToProcessor = () => `${__dirname}/northCarolinaNewsletterDeliveryJobProcessor.js`
}

export default NorthCarolinaNewsletterDeliveryQueueFactory
