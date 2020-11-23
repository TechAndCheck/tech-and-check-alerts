import { STATEMENT_SCRAPER_NAMES } from './constants'

import { runSequence } from '../../utils'
import {
  squishStatementsText,
} from '../../utils/scraper'
import {
  isTranscriptUrl,
  getFullMtpUrl,
  getTranscriptChunksFromHtml,
  removeDescriptors,
  extractStatementsFromChunks,
  removeUnattributableStatements,
  cleanStatementSpeakerNames,
} from '../../utils/mtp'

import AbstractStatementScraper from './AbstractStatementScraper'

class MtpTranscriptStatementScraper extends AbstractStatementScraper {
  constructor(url) {
    if (!isTranscriptUrl(url)) {
      throw new Error('MtpTranscriptStatementScraper was passed a URL that does not appear to be a Meet the Press transcript.')
    }
    super(getFullMtpUrl(url))
  }

  getScraperName = () => STATEMENT_SCRAPER_NAMES.MTP_TRANSCRIPT

  getStatementCanonicalUrl = () => this.getScrapeUrl()

  getStatementSource = () => {
    const showName = 'Meet the Press'
    return showName
  }

  generateScrapeHeaders = () => ({
    'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36',
  })

  statementScrapeHandler = responseString => runSequence(
    [
      getTranscriptChunksFromHtml,
      removeDescriptors,
      extractStatementsFromChunks,
      removeUnattributableStatements,
      cleanStatementSpeakerNames,
      squishStatementsText,
    ],
    responseString,
  )
}

export default MtpTranscriptStatementScraper
