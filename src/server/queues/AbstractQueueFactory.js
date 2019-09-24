import Queue from 'bull'
import config from '../config'
import logger from '../utils/logger'

class AbstractQueueFactory {
  /**
   * Abstract method that provides the name of the queue.
   * The queue name should ultimately be stored as a constant in queues/index.js
   *
   * OVERRIDE WHEN EXTENDING
   *
   * @return {string} the name of the queue
   */
  getQueueName = () => {
    throw new Error('You extended AbstractQueueFactory but forgot to define getQueueName()')
  }

  /**
   * Abstract method that provides the relative path to the job processor
   *
   * OVERRIDE WHEN EXTENDING
   *
   * @return {string} the relative path to the job processor
   */
  getPathToProcessor = () => {
    throw new Error('You extended AbstractQueueFactory but forgot to define getPathToProcessor()')
  }

  getQueueOptions = () => ({
    redis: config.REDIS_URL,
  })

  getQueue = () => {
    const queue = new Queue(
      this.getQueueName(),
      config.REDIS_URL,
      {
        defaultJobOptions: {
          removeOnComplete: true,
        },
      },
    )
    queue.on('error', error => logger.error(error))
    queue.on('failed', (job, error) => logger.warn(error))
    return queue
  }

  startQueueProcessor = () => {
    logger.debug(`Starting queue processor: ${this.getQueueName()}`)
    const queue = this.getQueue()
    queue.process(this.getPathToProcessor())
  }
}

export default AbstractQueueFactory
