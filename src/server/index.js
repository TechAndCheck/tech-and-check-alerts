import queueDicts from './queues'
import { getQueueFromQueueDict } from './utils/queue'
import logger from './utils/logger'

queueDicts.forEach(async (queueDict) => {
  const queue = getQueueFromQueueDict(queueDict)
  const repeatableJobs = await queue.getRepeatableJobs()

  logger.info(`==${queue.name} Jobs==`)
  if (repeatableJobs.length === 0) {
    logger.info('no scheduled jobs')
  } else {
    repeatableJobs.forEach(job => logger.info(`* ${job.name} (${job.cron})`))
  }
})
