import HelloWorldNewsletterQueueFactory from './HelloWorldNewsletterQueueFactory'
import HelloWorldNewsletterJobScheduler from './HelloWorldNewsletterJobScheduler'
import helloWorldNewsletterJobProcessor from './helloWorldNewsletterJobProcessor'

export default {
  factory: new HelloWorldNewsletterQueueFactory(),
  scheduler: new HelloWorldNewsletterJobScheduler(),
  processor: helloWorldNewsletterJobProcessor,
}
