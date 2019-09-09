import cheerio from 'cheerio'
import memoizeOne from 'memoize-one'
import logger from '../../utils/logger'

import { STATEMENT_SCRAPER_NAMES } from './constants'

import { runSequence } from '../../utils'
import {
  squishStatementsText,
} from '../../utils/scraper'
import {
  isTranscriptUrl,
  getFullCnnUrl,
  getTranscriptTextFromHtml,
  removeTimestamps,
  removeSpeakerReminders,
  removeDescriptors,
  addBreaksOnSpeakerChange,
  splitTranscriptIntoChunks,
  extractStatementsFromChunks,
  removeNetworkAffiliatedStatements,
  removeUnattributableStatements,
  cleanStatementSpeakerNames,
  normalizeStatementSpeakers,
} from '../../utils/cnn'

import AbstractStatementScraper from './AbstractStatementScraper'

const $ = cheerio

class CnnTranscriptStatementScraper extends AbstractStatementScraper {
  constructor(url) {
    if (!isTranscriptUrl(url)) {
      throw new Error('CnnTranscriptStatementScraper was passed a URL that does not appear to be a CNN transcript.')
    }
    super(getFullCnnUrl(url))
  }

  getScraperName = () => STATEMENT_SCRAPER_NAMES.CNN_TRANSCRIPT

  getStatementCanonicalUrl = () => this.getScrapeUrl()

  getStatementSource = () => {
    const scrapeResponse = this.getScrapeResponse()
    const showName = this.getShowName(scrapeResponse)
    return showName
  }

  /**
   * Extracts and returns the show name from the scraped transcript body.
   *
   * A note on the memoization: currently, CNN transcripts are organized by show, so all statements
   * from a single transcript scrape share the same source. Rather than re-extract the show name
   * for every statement, we memoize a single extraction function so that subsequent invocations
   * with the same input immediately receive the already-calculated output.
   *
   * @param {String} html The scraped transcript HTML
   * @return {String}     The show name or an empty fallback string
   */
  getShowName = memoizeOne((html) => {
    const $headlineElements = $(html).find('.cnnTransStoryHead')
    const headlineTexts = $headlineElements.map((i, element) => $(element).text())

    if (headlineTexts.length < 1) {
      logger.warn(`CnnTranscriptStatementScraper could not find a show name for ${this.getScrapeUrl()}`)
      return ''
    }
    return headlineTexts[0].trim()
  })

  statementScrapeHandler = responseString => runSequence(
    [
      getTranscriptTextFromHtml,
      removeTimestamps,
      removeSpeakerReminders,
      removeDescriptors,
      addBreaksOnSpeakerChange,
      splitTranscriptIntoChunks,
      extractStatementsFromChunks,
      cleanStatementSpeakerNames,
      normalizeStatementSpeakers,
      removeNetworkAffiliatedStatements,
      removeUnattributableStatements,
      squishStatementsText,
    ],
    responseString,
  )
}

export default CnnTranscriptStatementScraper
