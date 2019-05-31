import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class NationalNewsletterQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.newsletterQueues.NATIONAL

  getPathToProcessor = () => `${__dirname}/nationalNewsletterJobProcessor.js`
}

export default NationalNewsletterQueueFactory
