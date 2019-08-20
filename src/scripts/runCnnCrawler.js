import cnnTranscriptPortalCrawlerQueueDict from '../server/queues/cnnTranscriptPortalCrawlerQueue'
import cnnTranscriptListCrawlerQueueDict from '../server/queues/cnnTranscriptListCrawlerQueue'
import cnnTranscriptTranscriptStatementScraperQueueDict from '../server/queues/cnnTranscriptStatementScraperQueue'
import claimBusterClaimDetectorQueueDict from '../server/queues/claimBusterClaimDetectorQueue'

import {
  getQueueFromQueueDict,
  startQueueProcessors,
} from '../server/utils/queue'
import logger from '../server/utils/logger'

const cnnTranscriptPortalCrawlerQueue = getQueueFromQueueDict(
  cnnTranscriptPortalCrawlerQueueDict,
)
cnnTranscriptPortalCrawlerQueue.add()

startQueueProcessors([
  cnnTranscriptPortalCrawlerQueueDict,
  cnnTranscriptListCrawlerQueueDict,
  cnnTranscriptTranscriptStatementScraperQueueDict,
  claimBusterClaimDetectorQueueDict,
])

logger.info('The crawler is running; you will have to manually exit this process.')
