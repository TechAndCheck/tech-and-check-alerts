
class AbstractJobScheduler {
  /**
   * The cron string representing the schedule to be run
   *
   * OVERRIDE WHEN EXTENDING
   */
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
   * Abstract method that provides the queue object that the schedule
   * should be applied to.
   *
   * @return {Queue} the queue object
   */
  getQueue = () => {
    throw new Error('You extended AbstractJobScheduler but forgot to define getQueue()')
  }

  getRepeatOptions = () => ({
    cron: this.getScheduleCron(),
  })

  getScheduleName = () => `repeating-${this.getQueue().name}`

  scheduleJobs = () => this.getQueue().add(
    this.getScheduleName(),
    {},
    { repeat: this.getRepeatOptions() },
  )

  unscheduleJobs = () => this.getQueue().removeRepeatable(
    this.getScheduleName(),
    this.getRepeatOptions(),
  )
}

export default AbstractJobScheduler
