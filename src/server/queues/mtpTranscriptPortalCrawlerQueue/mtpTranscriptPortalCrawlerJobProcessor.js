import logger from '../../utils/logger'
import { MtpTranscriptPortalCrawler } from '../../workers/crawlers/MtpCrawlers'
import MtpTranscriptStatementScraper from '../../workers/scrapers/MtpTranscriptStatementScraper'
import mtpTranscriptStatementScraperQueueDict from '../mtpTranscriptStatementScraperQueue'
import { isDateBeyondScrapeHorizon } from '../../utils/scraper'
import { extractPublicationDateFromTranscriptUrl } from '../../utils/mtp'
import { getQueueFromQueueDict } from '../../utils/queue'

const statementScraperQueue = getQueueFromQueueDict(mtpTranscriptStatementScraperQueueDict)

const scrapeTranscriptUrl = url => statementScraperQueue.add({ url })

const processTranscriptUrl = async (url) => {
  const scraper = new MtpTranscriptStatementScraper(url)
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

export default async () => {
  const crawler = new MtpTranscriptPortalCrawler()
  const crawlResults = await crawler.run()
  crawlResults.forEach(processTranscriptUrl)
  return crawlResults
}
