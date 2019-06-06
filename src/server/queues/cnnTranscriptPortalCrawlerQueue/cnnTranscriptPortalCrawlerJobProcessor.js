import { CnnTranscriptPortalCrawler } from '../../workers/crawlers/CnnCrawlers'
import cnnTranscriptListCrawlerQueueDict from '../cnnTranscriptListCrawlerQueue'

const listCrawlerQueue = cnnTranscriptListCrawlerQueueDict.factory.getQueue()

const crawlTranscriptListUrl = url => listCrawlerQueue.add({ url })

export default async () => {
  const crawler = new CnnTranscriptPortalCrawler()
  const crawlResults = await crawler.run()
  crawlResults.forEach(crawlTranscriptListUrl)
  return crawlResults
}
