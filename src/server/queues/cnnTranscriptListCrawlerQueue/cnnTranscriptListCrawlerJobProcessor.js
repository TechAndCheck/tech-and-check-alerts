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
  const urlPublicationDate = extractPublicationDateFromTranscriptUrl(url)
  if (isDateBeyondScrapeHorizon(urlPublicationDate)) {
    logger.debug(`Skipping: ${url} was published on ${urlPublicationDate} before the horizon`)
  } else {
    const recentSuccessfulScrapeTime = await scraper.getMostRecentSuccessfulScrapeTime()
    if (recentSuccessfulScrapeTime) {
      logger.debug(`Skipping: ${url} was successfully scraped on ${recentSuccessfulScrapeTime.format('YYYY-MM-DD')}`)
    } else {
      scrapeTranscriptUrl(url)
    }
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
