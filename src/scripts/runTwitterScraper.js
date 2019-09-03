import twitterScrapeInitiationQueueDict from '../server/queues/twitterScrapeInitiationQueue'
import twitterAccountStatementScraperQueueDict from '../server/queues/twitterAccountStatementScraperQueue'
import claimBusterClaimDetectorQueueDict from '../server/queues/claimBusterClaimDetectorQueue'

import {
  getQueueFromQueueDict,
  startQueueProcessors,
} from '../server/utils/queue'
import logger from '../server/utils/logger'

const twitterScrapeInitiationQueue = getQueueFromQueueDict(
  twitterScrapeInitiationQueueDict,
)
twitterScrapeInitiationQueue.add()

startQueueProcessors([
  twitterScrapeInitiationQueueDict,
  twitterAccountStatementScraperQueueDict,
  claimBusterClaimDetectorQueueDict,
])

logger.info('The twitter crawler is running; you will have to manually exit this process.')
