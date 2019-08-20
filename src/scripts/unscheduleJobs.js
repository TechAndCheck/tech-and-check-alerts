import queueDicts from '../server/queues'
import { getQueueFromQueueDict } from '../server/utils/queue'
import logger from '../server/utils/logger'

const softUnscheduleJobs = queueDict => queueDict.scheduler.unscheduleJobs()

const hardUnscheduleJobs = async (queueDict) => {
  const queue = getQueueFromQueueDict(queueDict)
  const jobs = await queue.getRepeatableJobs()
  return Promise.all(jobs.map(job => queue.removeRepeatableByKey(job.key)))
}

const isHardFlagSet = () => process.argv.includes('--hard')

const unscheduleJobs = (queueDict) => {
  if (isHardFlagSet()) {
    return hardUnscheduleJobs(queueDict)
  }
  return softUnscheduleJobs(queueDict)
}

const promises = queueDicts.map(unscheduleJobs)
Promise.all(promises)
  .then((results) => {
    logger.info(`Jobs ${isHardFlagSet() ? '(hard) ' : ''}unscheduled for ${results.length} queues`)
  })
  .catch(error => logger.error(`Could not unschedule all jobs: ${error}`))
  .finally(() => process.exit())
