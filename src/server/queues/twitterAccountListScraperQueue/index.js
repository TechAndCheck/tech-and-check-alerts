import TwitterAccountListScraperQueueFactory from './TwitterAccountListScraperQueueFactory'
import TwitterAccountListScraperJobScheduler from './TwitterAccountListScraperJobScheduler'
import twitterAccountListScraperJobProcessor from './twitterAccountListScraperJobProcessor'

export default {
  factory: new TwitterAccountListScraperQueueFactory(),
  scheduler: new TwitterAccountListScraperJobScheduler(),
  processor: twitterAccountListScraperJobProcessor,
}
