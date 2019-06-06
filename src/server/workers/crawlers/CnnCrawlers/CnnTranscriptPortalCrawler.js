import AbstractCrawler from '../AbstractCrawler'
import { extractUrls } from '../../../utils/crawler'
import { isTranscriptListUrl } from '../../../utils/cnn'

class CnnTranscriptPortalCrawler extends AbstractCrawler {
  constructor() {
    super('http://transcripts.cnn.com/TRANSCRIPTS/')
  }

  crawlHandler = responseString => extractUrls(responseString)
    .filter(isTranscriptListUrl)
}

export default CnnTranscriptPortalCrawler
