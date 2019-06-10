import queueDicts from '../server/queues'
import { getRepeatableJobsFromQueueDict } from '../server/utils/queue'
import logger from '../server/utils/logger'

const renderJobList = jobList => jobList.forEach((job) => {
  const { key } = job
  logger.info(`Scheduled Job: ${key}`)
})

const promises = queueDicts.map(getRepeatableJobsFromQueueDict)
Promise.all(promises).then((jobLists) => {
  jobLists.forEach(renderJobList)
  process.exit()
})
