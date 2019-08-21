import queueDicts from '../server/queues'
import logger from '../server/utils/logger'

const scheduleJobs = queueDict => queueDict.scheduler.scheduleJobs()

const isJob = job => (!!job && job.constructor.name === 'Job')

const renderScheduledJobs = scheduledJobs => scheduledJobs
  .filter(isJob)
  .forEach(job => logger.info(`Scheduled job: ${job.toKey()}`))

const scheduleableQueues = queueDicts.filter(queueDict => queueDict.scheduler.getIsScheduled())
const promises = scheduleableQueues.map(scheduleJobs)
Promise.all(promises)
  .then((jobs) => {
    renderScheduledJobs(jobs)
  })
  .catch(error => logger.error(`Could not schedule all jobs: ${error}`))
  .finally(() => process.exit())
