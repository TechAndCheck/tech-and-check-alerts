import queueDicts from './queues'
import { getQueueFromQueueDict } from './utils/queue'

queueDicts.forEach(async (queueDict) => {
  const queue = getQueueFromQueueDict(queueDict)
  const repeatableJobs = await queue.getRepeatableJobs()

  console.log(`==${queue.name} Jobs==`)
  if (repeatableJobs.length === 0) {
    console.log('none')
  } else {
    repeatableJobs.forEach(job => console.log(`* ${job.name} (${job.cron})`))
  }
})
