import newsletterDeliveryInitiationQueueDict from '../server/queues/newsletterDeliveryInitiationQueue'
import newsletterDeliveryQueueDict from '../server/queues/newsletterDeliveryQueue'

import {
  getQueueFromQueueDict,
  startQueueProcessors,
} from '../server/utils/queue'
import logger from '../server/utils/logger'

const newsletterDeliveryInitiationQueue = getQueueFromQueueDict(
  newsletterDeliveryInitiationQueueDict,
)
newsletterDeliveryInitiationQueue.add()

startQueueProcessors([
  newsletterDeliveryInitiationQueueDict,
  newsletterDeliveryQueueDict,
])

logger.info('The newsletter delivery is running; you will have to manually exit this process.')
