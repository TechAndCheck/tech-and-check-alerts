import TwitterAccountStatementScraperQueueFactory from './TwitterAccountStatementScraperQueueFactory'
import TwitterAccountStatementScraperJobScheduler from './TwitterAccountStatementScraperJobScheduler'
import twitterAccountStatementScraperJobProcessor from './twitterAccountStatementScraperJobProcessor'

export default {
  factory: new TwitterAccountStatementScraperQueueFactory(),
  scheduler: new TwitterAccountStatementScraperJobScheduler(),
  processor: twitterAccountStatementScraperJobProcessor,
}
