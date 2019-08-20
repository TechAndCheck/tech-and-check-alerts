import { CnnTranscriptPortalCrawler } from '../../workers/crawlers/CnnCrawlers'
import cnnTranscriptListCrawlerQueueDict from '../cnnTranscriptListCrawlerQueue'
import { getQueueFromQueueDict } from '../../utils/queue'

const listCrawlerQueue = getQueueFromQueueDict(cnnTranscriptListCrawlerQueueDict)

const crawlTranscriptListUrl = url => listCrawlerQueue.add({ url })

export default async () => {
  const crawler = new CnnTranscriptPortalCrawler()
  const crawlResults = await crawler.run()
  crawlResults.forEach(crawlTranscriptListUrl)
  return crawlResults
}
