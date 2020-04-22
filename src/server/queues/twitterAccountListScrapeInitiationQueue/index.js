import TwitterAccountListScrapeInitiationQueueFactory from './TwitterAccountListScrapeInitiationQueueFactory'
import TwitterAccountListScrapeInitiationJobScheduler from './TwitterAccountListScrapeInitiationJobScheduler'
import twitterAccountListScrapeInitiationJobProcessor from './twitterAccountListScrapeInitiationJobProcessor'

export default {
  factory: new TwitterAccountListScrapeInitiationQueueFactory(),
  scheduler: new TwitterAccountListScrapeInitiationJobScheduler(),
  processor: twitterAccountListScrapeInitiationJobProcessor,
}
