
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
   * OVERRIDE WHEN EXTENDING
   *
   * @return {Queue} the queue object
   */
  getQueue = () => {
    throw new Error('You extended AbstractJobScheduler but forgot to define getQueue()')
  }

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
  })

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
