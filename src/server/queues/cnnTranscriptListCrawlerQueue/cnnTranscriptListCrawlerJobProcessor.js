import { CnnTranscriptListCrawler } from '../../workers/crawlers/CnnCrawlers'

import cnnTranscriptStatementScraperQueueDict from '../cnnTranscriptStatementScraperQueue'

const statementScraperQueue = cnnTranscriptStatementScraperQueueDict.factory.getQueue()

const scrapeTranscriptUrl = url => statementScraperQueue.add({ url })

export default async (job) => {
  const {
    data: {
      url,
    },
  } = job
  const crawler = new CnnTranscriptListCrawler(url)
  const crawlResults = await crawler.run()
  crawlResults.forEach(scrapeTranscriptUrl)
  return crawlResults
}
