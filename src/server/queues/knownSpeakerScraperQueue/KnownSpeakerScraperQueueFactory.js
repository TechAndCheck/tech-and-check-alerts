import { QueueNames } from '../constants'
import AbstractQueueFactory from '../AbstractQueueFactory'

class KnownSpeakerScraperQueueFactory extends AbstractQueueFactory {
  getQueueName = () => QueueNames.scraperQueues.KNOWN_SPEAKER

  getPathToProcessor = () => `${__dirname}/knownSpeakerScraperJobProcessor.js`
}

export default KnownSpeakerScraperQueueFactory
