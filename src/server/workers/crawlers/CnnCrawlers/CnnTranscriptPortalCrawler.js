import AbstractCrawler from '../AbstractCrawler'
import { extractUrls } from '../../../utils/crawler'

class CnnTranscriptPortalCrawler extends AbstractCrawler {
  constructor() {
    super('http://transcripts.cnn.com/TRANSCRIPTS/')
  }

  isTranscriptListUrl = url => url.startsWith('/TRANSCRIPTS/')

  crawlHandler = responseString => extractUrls(responseString)
    .filter(this.isTranscriptListUrl)
}

export default CnnTranscriptPortalCrawler
