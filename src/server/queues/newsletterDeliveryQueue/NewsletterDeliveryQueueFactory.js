import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class NewsletterDeliveryQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.newsletterDeliveryQueues.NEWSLETTER_DELIVERY

  getPathToProcessor = () => `${__dirname}/newsletterDeliveryJobProcessor.js`
}

export default NewsletterDeliveryQueueFactory
