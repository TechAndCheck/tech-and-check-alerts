import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class HelloWorldCrawlerQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.crawlerQueues.HELLO_WORLD

  getPathToProcessor = () => `${__dirname}/helloWorldCrawlerJobProcessor.js`
}

export default HelloWorldCrawlerQueueFactory
