import CnnTranscriptListCrawlerQueueFactory from './CnnTranscriptListCrawlerQueueFactory'
import CnnTranscriptListCrawlerJobScheduler from './CnnTranscriptListCrawlerJobScheduler'
import cnnTranscriptListCrawlerJobProcessor from './cnnTranscriptListCrawlerJobProcessor'

export default {
  factory: new CnnTranscriptListCrawlerQueueFactory(),
  scheduler: new CnnTranscriptListCrawlerJobScheduler(),
  processor: cnnTranscriptListCrawlerJobProcessor,
}
