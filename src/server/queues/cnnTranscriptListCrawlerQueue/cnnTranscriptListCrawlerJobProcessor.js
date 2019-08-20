import logger from '../../utils/logger'
import { CnnTranscriptListCrawler } from '../../workers/crawlers/CnnCrawlers'
import CnnTranscriptStatementScraper from '../../workers/scrapers/CnnTranscriptStatementScraper'
import cnnTranscriptStatementScraperQueueDict from '../cnnTranscriptStatementScraperQueue'
import { isDateBeyondScrapeHorizon } from '../../utils/scraper'
import { extractPublicationDateFromTranscriptUrl } from '../../utils/cnn'
import { getQueueFromQueueDict } from '../../utils/queue'

const statementScraperQueue = getQueueFromQueueDict(cnnTranscriptStatementScraperQueueDict)

const scrapeTranscriptUrl = url => statementScraperQueue.add({ url })

const processTranscriptUrl = async (url) => {
  const scraper = new CnnTranscriptStatementScraper(url)
  const recentScrapeTime = await scraper.getMostRecentScrapeTime()
  const urlPublicationDate = extractPublicationDateFromTranscriptUrl(url)
  if (recentScrapeTime) {
    logger.debug(`Skipping: ${url} was scraped on ${recentScrapeTime.format('YYYY-MM-DD')}`)
  } else if (isDateBeyondScrapeHorizon(urlPublicationDate)) {
    logger.debug(`Skipping: ${url} was published on ${urlPublicationDate} before the horizon`)
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
