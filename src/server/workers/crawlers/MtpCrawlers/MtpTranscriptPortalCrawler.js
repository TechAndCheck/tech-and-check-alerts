import AbstractCrawler from '../AbstractCrawler'
import { extractUrls } from '../../../utils/crawler'
import { isTranscriptUrl } from '../../../utils/mtp'
import { CRAWLER_NAMES } from '../constants'

class MtpTranscriptPortalCrawler extends AbstractCrawler {
  constructor() {
    super('https://www.nbcnews.com/meet-the-press/meet-press-transcripts-n51976')
  }

  getScraperName = () => CRAWLER_NAMES.MTP_TRANSCRIPT_PORTAL

  generateScrapeHeaders = () => ({
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36',
  })

  crawlHandler = responseString => extractUrls(responseString)
    .filter(isTranscriptUrl)
}

export default MtpTranscriptPortalCrawler
