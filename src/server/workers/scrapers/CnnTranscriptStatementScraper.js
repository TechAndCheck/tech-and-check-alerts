import cheerio from 'cheerio'
import logger from '../../utils/logger'

import { STATEMENT_SCRAPER_NAMES } from './constants'

import {
  isTranscriptUrl,
  getFullCnnUrl,
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

  getCanonicalUrl = () => this.getScrapeUrl()

  getSource = () => this.source

  setSource = (html) => {
    this.source = this.getShowName(html)
  }

  getShowName = (html) => {
    const $headlineElements = $(html).find('.cnnTransStoryHead')
    const headlineTexts = $headlineElements.map((i, element) => $(element).text())

    if (headlineTexts.length < 1) {
      logger.warn(`CnnTranscriptStatementScraper could not find a show name for ${this.getScrapeUrl()}`)
      return ''
    }
    return headlineTexts[0].trim()
  }

  getTranscriptText = (html) => {
    const $bodyTextElements = $(html).find('.cnnBodyText')
    const bodyTexts = $bodyTextElements.map((i, element) => $(element).text())

    if (bodyTexts.length < 3) {
      throw new Error('The CnnTranscriptStatementScraper received an unexpected transcript format.')
    }
    return bodyTexts[2]
  }

  extractStatementsFromTranscript = (transcript) => {
    const stepSequence = [
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
    ] // Note that order does matter here

    const statements = stepSequence.reduce((string, fn) => fn(string), transcript)
    return statements
  }

  statementScrapeHandler = (responseString) => {
    this.setSource(responseString)
    const transcript = this.getTranscriptText(responseString)
    const statements = this.extractStatementsFromTranscript(transcript)
    return statements
  }
}

export default CnnTranscriptStatementScraper
