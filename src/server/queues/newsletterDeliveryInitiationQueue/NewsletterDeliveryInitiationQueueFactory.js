import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class NewsletterDeliveryInitiationQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.newsletterDeliveryQueues.NEWSLETTER_DELIVERY_INITIATION

  getPathToProcessor = () => `${__dirname}/newsletterDeliveryInitiationJobProcessor.js`
}

export default NewsletterDeliveryInitiationQueueFactory
