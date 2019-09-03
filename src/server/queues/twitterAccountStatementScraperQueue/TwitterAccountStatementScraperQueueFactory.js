import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class TwitterAccountStatementScraperQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.scraperQueues.TWITTER_ACCOUNT_STATEMENT

  getPathToProcessor = () => `${__dirname}/twitterAccountStatementScraperJobProcessor.js`
}

export default TwitterAccountStatementScraperQueueFactory
