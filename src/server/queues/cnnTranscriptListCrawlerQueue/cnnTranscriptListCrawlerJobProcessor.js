import logger from '../../utils/logger'
import { CnnTranscriptListCrawler } from '../../workers/crawlers/CnnCrawlers'
import CnnTranscriptStatementScraper from '../../workers/scrapers/CnnTranscriptStatementScraper'
import cnnTranscriptStatementScraperQueueDict from '../cnnTranscriptStatementScraperQueue'

const statementScraperQueue = cnnTranscriptStatementScraperQueueDict.factory.getQueue()

const scrapeTranscriptUrl = url => statementScraperQueue.add({ url })

const processTranscriptUrl = async (url) => {
  const scraper = new CnnTranscriptStatementScraper(url)
  const recentScrapeTime = await scraper.getMostRecentScrapeTime()

  if (recentScrapeTime) {
    logger.debug(`Skipping: ${url} was scraped on ${recentScrapeTime.format('YYYY-MM-DD')}`)
  } else {
    scrapeTranscriptUrl(url)
  }
}

export default async (job) => {
  const {
    data: {
      url,
    },
  } = job
  const crawler = new CnnTranscriptListCrawler(url)
  const crawlResults = await crawler.run()
  crawlResults.forEach(processTranscriptUrl)
  return crawlResults
}
