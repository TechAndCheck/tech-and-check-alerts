import AbstractCrawler from '../AbstractCrawler'
import { extractUrls } from '../../../utils/crawler'
import {
  isTranscriptListUrl,
  isTranscriptUrl,
  getFullCnnUrl,
} from '../../../utils/cnn'

class CnnTranscriptListCrawler extends AbstractCrawler {
  constructor(url) {
    if (!isTranscriptListUrl(url)) {
      throw new Error('CnnTranscriptListCrawler was passed a URL that does not appear to be a CNN transcript list.')
    }
    super(getFullCnnUrl(url))
  }

  crawlHandler = responseString => extractUrls(responseString)
    .filter(isTranscriptUrl)
}

export default CnnTranscriptListCrawler
