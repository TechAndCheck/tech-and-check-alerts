import queueDicts from '../server/queues'
import logger from '../server/utils/logger'

const scheduleJobs = queueDict => queueDict.scheduler.scheduleJobs()

const renderResults = (results) => {
  results.forEach(result => logger.info(`Scheduled job: ${result.name}`))
}

const promises = queueDicts.map(scheduleJobs)
Promise.all(promises).then((results) => {
  renderResults(results)
  process.exit()
})
