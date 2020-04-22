import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class TwitterAccountListScrapeInitiationQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.scraperQueues.TWITTER_ACCOUNT_LIST_SCRAPE_INITITATION

  getPathToProcessor = () => `${__dirname}/twitterAccountListScrapeInitiationJobProcessor.js`
}

export default TwitterAccountListScrapeInitiationQueueFactory
