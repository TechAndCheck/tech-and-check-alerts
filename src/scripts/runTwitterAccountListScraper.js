import twitterAccountListScrapeInitiationQueueDict from '../server/queues/twitterAccountListScrapeInitiationQueue'
import twitterAccountListScraperQueueDict from '../server/queues/twitterAccountListScraperQueue'

import {
  getQueueFromQueueDict,
  startQueueProcessors,
} from '../server/utils/queue'
import logger from '../server/utils/logger'

const twitterAccountListScrapeInitiationQueue = getQueueFromQueueDict(
  twitterAccountListScrapeInitiationQueueDict,
)
twitterAccountListScrapeInitiationQueue.add()

startQueueProcessors([
  twitterAccountListScrapeInitiationQueueDict,
  twitterAccountListScraperQueueDict,
])

logger.info('The twitter crawler is running; you will have to manually exit this process.')
