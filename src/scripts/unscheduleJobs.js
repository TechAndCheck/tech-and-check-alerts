import queueDicts from '../server/queues'
import { getQueueFromQueueDict } from '../server/utils/queue'

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
const renderResults = (results) => {
  console.log(results)
}

const promises = queueDicts.map(unscheduleJobs)
Promise.all(promises).then((results) => {
  renderResults(results)
  process.exit()
})
