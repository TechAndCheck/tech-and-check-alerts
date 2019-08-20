import { QUEUE_SCHEDULER_TIMEZONE } from './constants'

class AbstractJobScheduler {
  /**
   * Abstract method that provides the cron string representing the schedule to be run.
   * The schedule should ultimately be stored as a constant in queues/index.js
   *
   * OVERRIDE WHEN EXTENDING
   *
   * @return {string} the schedule string
   */
  getScheduleCron = () => {
    throw new Error('You extended AbstractJobScheduler but forgot to define getScheduleCron()')
  }

  /**
   * Abstract method that provides the queue factory for the queue that the schedule
   * should be applied to.
   *
   * OVERRIDE WHEN EXTENDING
   *
   * @return {AbstractQueueFactory} The instantiated queue factory
   */
  getQueueFactory = () => {
    throw new Error('You extended AbstractJobScheduler but forgot to define getQueueFactory()')
  }

  /**
   * Invokes getQueueFactory to actually get the insertion queue
   * @return {Queue} The queue to schedule against
   */
  getQueue = () => this.getQueueFactory().getQueue()

  /**
   * Method that provides the job information that should be part of the scheduled
   * task.
   *
   * This does not need to be overridden when extending, but can be.
   *
   * @return {Object} The object to be passed to the job processor for repeated jobs
   */
  getJobData = () => ({})

  getRepeatOptions = () => ({
    cron: this.getScheduleCron(),
    tz: QUEUE_SCHEDULER_TIMEZONE,
  })

  scheduleJobs = () => this.getQueue().add(
    this.getJobData(),
    { repeat: this.getRepeatOptions() },
  )

  unscheduleJobs = () => this.getQueue().removeRepeatable(
    this.getRepeatOptions(),
  )
}

export default AbstractJobScheduler
