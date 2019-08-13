import AbstractCrawler from '../AbstractCrawler'
import { extractUrls } from '../../../utils/crawler'
import {
  isTranscriptListUrl,
  isTranscriptUrl,
  getFullCnnUrl,
} from '../../../utils/cnn'
import { CRAWLER_NAMES } from '../constants'

class CnnTranscriptListCrawler extends AbstractCrawler {
  constructor(url) {
    if (!isTranscriptListUrl(url)) {
      throw new Error('CnnTranscriptListCrawler was passed a URL that does not appear to be a CNN transcript list.')
    }
    super(getFullCnnUrl(url))
  }

  getScraperName = () => CRAWLER_NAMES.CNN_TRANSCRIPT_LIST

  crawlHandler = responseString => extractUrls(responseString)
    .filter(isTranscriptUrl)
}

export default CnnTranscriptListCrawler
