import mtpTranscriptPortalCrawlerQueueDict from '../server/queues/mtpTranscriptPortalCrawlerQueue'
import mtpTranscriptTranscriptStatementScraperQueueDict from '../server/queues/mtpTranscriptStatementScraperQueue'
import claimBusterClaimDetectorQueueDict from '../server/queues/claimBusterClaimDetectorQueue'

import {
  getQueueFromQueueDict,
  startQueueProcessors,
} from '../server/utils/queue'
import logger from '../server/utils/logger'

const mtpTranscriptPortalCrawlerQueue = getQueueFromQueueDict(
  mtpTranscriptPortalCrawlerQueueDict,
)
mtpTranscriptPortalCrawlerQueue.add()

startQueueProcessors([
  mtpTranscriptPortalCrawlerQueueDict,
  mtpTranscriptTranscriptStatementScraperQueueDict,
  claimBusterClaimDetectorQueueDict,
])

logger.info('The crawler is running; you will have to manually exit this process.')
