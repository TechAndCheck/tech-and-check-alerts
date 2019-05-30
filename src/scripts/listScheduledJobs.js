import queueDicts from '../server/queues'
import { getRepeatableJobsFromQueueDict } from '../server/utils/queue'

const renderResults = (results) => {
  results.forEach(result => console.log(result))
}

const promises = queueDicts.map(getRepeatableJobsFromQueueDict)
Promise.all(promises).then((results) => {
  renderResults(results)
  process.exit()
})
