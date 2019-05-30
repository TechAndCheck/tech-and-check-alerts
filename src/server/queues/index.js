import fs from 'fs'
import config from '../config'

const isDirectory = path => fs.lstatSync(path).isDirectory()
const isJobProcessor = file => file.endsWith('JobProcessor.js')
const isJobScheduler = file => file.endsWith('JobScheduler.js')
const isQueueFactory = file => file.endsWith('QueueFactory.js')
const isIndex = file => file === 'index.js'

const isDirectoryAndContainsQueueFiles = (path) => {
  if (!isDirectory(path)) {
    return false
  }

  const files = fs.readdirSync(path)
  let jobProcessorExists = false
  let jobSchedulerExists = false
  let queueFactoryExists = false
  let indexExists = false

  files.forEach((file) => {
    jobProcessorExists = jobProcessorExists || isJobProcessor(file)
    jobSchedulerExists = jobSchedulerExists || isJobScheduler(file)
    queueFactoryExists = queueFactoryExists || isQueueFactory(file)
    indexExists = indexExists || isIndex(file)
  })

  return jobProcessorExists
    && jobSchedulerExists
    && queueFactoryExists
    && indexExists
}

const isQueueDirectoryEnabled = (queueDirectory) => {
  const { ENABLED_QUEUE_DIRECTORIES } = config
  return ENABLED_QUEUE_DIRECTORIES.includes(queueDirectory)
  || ENABLED_QUEUE_DIRECTORIES.includes('*')
}

const getQueueDirectories = () => fs.readdirSync(__dirname)
  .filter(file => (
    isQueueDirectoryEnabled(file)
    && isDirectoryAndContainsQueueFiles(`${__dirname}/${file}`)
  ))

// ESlint really doesn't want you to dynamically require stuff
// We should really consider throwing all of this beautiful code away and
// instead explicitly requiring the queues individually.
// eslint-disable-next-line import/no-dynamic-require, global-require
const loadQueue = file => require(`${__dirname}/${file}`).default

const loadQueues = () => {
  const queueDirectories = getQueueDirectories()
  return queueDirectories.map(loadQueue)
}

export default loadQueues()
