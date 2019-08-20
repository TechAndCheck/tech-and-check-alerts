export const startQueueProcessorFromQueueDict = (queueDict) => {
  const queueFactory = queueDict.factory
  return queueFactory.startQueueProcessor()
}

export const getQueueFromQueueDict = (queueDict) => {
  const queueFactory = queueDict.factory
  return queueFactory.getQueue()
}

export const getRepeatableJobsFromQueueDict = async (queueDict) => {
  const queue = getQueueFromQueueDict(queueDict)
  return queue.getRepeatableJobs()
}

export const startQueueProcessors = queueDicts => queueDicts
  .forEach(startQueueProcessorFromQueueDict)
