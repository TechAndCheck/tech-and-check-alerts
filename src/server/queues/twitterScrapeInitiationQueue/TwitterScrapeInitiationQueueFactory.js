import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class TwitterScrapeInitiationQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.scraperQueues.TWITTER_SCRAPE_INITITATION

  getPathToProcessor = () => `${__dirname}/twitterScrapeInitiationJobProcessor.js`
}

export default TwitterScrapeInitiationQueueFactory
