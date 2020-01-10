import KnownSpeakerScraperQueueFactory from './KnownSpeakerScraperQueueFactory'
import AbstractJobScheduler from '../AbstractJobScheduler'
import { Schedules } from '../constants'

class KnownSpeakerScraperJobScheduler extends AbstractJobScheduler {
  getScheduleCron = () => Schedules.EVERY_DAY

  getQueueFactory = () => new KnownSpeakerScraperQueueFactory()
}

export default KnownSpeakerScraperJobScheduler
