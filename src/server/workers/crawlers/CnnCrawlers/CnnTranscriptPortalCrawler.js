import AbstractCrawler from '../AbstractCrawler'
import { extractUrls } from '../../../utils/crawler'
import { isTranscriptListUrl } from '../../../utils/cnn'
import { CRAWLER_NAMES } from '../constants'

class CnnTranscriptPortalCrawler extends AbstractCrawler {
  constructor() {
    super('http://transcripts.cnn.com/')
  }

  getScraperName = () => CRAWLER_NAMES.CNN_TRANSCRIPT_PORTAL

  crawlHandler = responseString => extractUrls(responseString)
    .filter(isTranscriptListUrl)
}

export default CnnTranscriptPortalCrawler
