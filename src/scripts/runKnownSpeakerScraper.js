import knownSpeakerScraperQueueDict from '../server/queues/knownSpeakerScraperQueue'

import {
  getQueueFromQueueDict,
  startQueueProcessors,
} from '../server/utils/queue'
import logger from '../server/utils/logger'

const knownSpeakerScraperQueue = getQueueFromQueueDict(
  knownSpeakerScraperQueueDict,
)
knownSpeakerScraperQueue.add()

startQueueProcessors([
  knownSpeakerScraperQueueDict,
])

logger.info('The known speaker scraper is running; you will have to manually exit this process.')
