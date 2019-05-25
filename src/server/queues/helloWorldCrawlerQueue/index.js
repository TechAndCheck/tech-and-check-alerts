import HelloWorldCrawlerQueueFactory from './HelloWorldCrawlerQueueFactory'
import HelloWorldCrawlerJobScheduler from './HelloWorldCrawlerJobScheduler'
import helloWorldCrawlerJobProcessor from './helloWorldCrawlerJobProcessor'

export default {
  factory: new HelloWorldCrawlerQueueFactory(),
  scheduler: new HelloWorldCrawlerJobScheduler(),
  processor: helloWorldCrawlerJobProcessor,
}
