import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class HelloWorldNewsletterQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.newsletterQueues.HELLO_WORLD

  getPathToProcessor = () => `${__dirname}/helloWorldNewsletterJobProcessor.js`
}

export default HelloWorldNewsletterQueueFactory
