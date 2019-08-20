import cheerio from 'cheerio'

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
  extractSourceFromTranscriptUrl,
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

  getSource = () => extractSourceFromTranscriptUrl(this.getScrapeUrl())

  getTranscriptText = (html) => {
    const $bodyTextElements = $(html).find('.cnnBodyText')
    const bodyTexts = $bodyTextElements.map((i, element) => $(element).text())

    if (bodyTexts.length < 3) {
      throw new Error('The CnnTranscriptStatementScraper received an unexpected transcript format.')
    }
    return bodyTexts[2]
  }

  addAdditionalPropertiesToStatements = statements => statements
    .map(statement => ({
      ...statement,
      scraperName: this.getScraperName(),
      canonicalUrl: this.getScrapeUrl(),
      source: this.getSource(),
    }))

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
      this.addAdditionalPropertiesToStatements,
    ] // Note that order does matter here

    const statements = stepSequence.reduce((string, fn) => fn(string), transcript)
    return statements
  }

  statementScrapeHandler = (responseString) => {
    const transcript = this.getTranscriptText(responseString)
    const statements = this.extractStatementsFromTranscript(transcript)
    return statements
  }
}

export default CnnTranscriptStatementScraper
