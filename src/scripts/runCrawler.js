import cnnTranscriptPortalCrawlerQueueDict from '../server/queues/cnnTranscriptPortalCrawlerQueue'
import { getQueueFromQueueDict } from '../server/utils/queue'
import logger from '../server/utils/logger'

const cnnTranscriptPortalCrawlerQueue = getQueueFromQueueDict(cnnTranscriptPortalCrawlerQueueDict)
cnnTranscriptPortalCrawlerQueue.add()
logger.info('The crawler is running; you will have to manually exit this process.')
