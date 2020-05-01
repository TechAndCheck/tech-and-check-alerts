import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class TwitterAccountListScraperQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.scraperQueues.TWITTER_ACCOUNT_LIST

  getPathToProcessor = () => `${__dirname}/twitterAccountListScraperJobProcessor.js`
}

export default TwitterAccountListScraperQueueFactory
