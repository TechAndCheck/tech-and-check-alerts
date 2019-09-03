import TwitterScrapeInitiationQueueFactory from './TwitterScrapeInitiationQueueFactory'
import TwitterScrapeInitiationJobScheduler from './TwitterScrapeInitiationJobScheduler'
import twitterScrapeInitiationJobProcessor from './twitterScrapeInitiationJobProcessor'

export default {
  factory: new TwitterScrapeInitiationQueueFactory(),
  scheduler: new TwitterScrapeInitiationJobScheduler(),
  processor: twitterScrapeInitiationJobProcessor,
}
