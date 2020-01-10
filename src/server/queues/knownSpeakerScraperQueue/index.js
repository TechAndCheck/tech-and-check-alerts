import KnownSpeakerScraperQueueFactory from './KnownSpeakerScraperQueueFactory'
import KnownSpeakerScraperJobScheduler from './KnownSpeakerScraperJobScheduler'
import knownSpeakerScraperJobProcessor from './knownSpeakerScraperJobProcessor'

export default {
  factory: new KnownSpeakerScraperQueueFactory(),
  scheduler: new KnownSpeakerScraperJobScheduler(),
  processor: knownSpeakerScraperJobProcessor,
}
