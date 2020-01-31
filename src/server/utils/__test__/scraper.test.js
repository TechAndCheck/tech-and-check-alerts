import dayjs from 'dayjs'
import {
  isDateBeyondScrapeHorizon,
  squishStatementsText,
  filterPreviouslyScrapedStatements,
  getUniqueCanonicalUrls,
} from '../scraper'

import config from '../../config'

describe('isDateBeyondScrapeHorizon', () => {
  const day = dayjs()
  it('Should recognize dates beyond the date horizon', () => {
    const beyondHorizonDate = day.subtract(config.SCRAPE_DAY_HORIZON + 1, 'day')
    expect(isDateBeyondScrapeHorizon(beyondHorizonDate))
      .toBe(true)
    expect(isDateBeyondScrapeHorizon(beyondHorizonDate.format()))
      .toBe(true)
  })
  it('Should recognize dates within the date horizon', () => {
    const withinHorizonDate = day.add(1, 'day')
    expect(isDateBeyondScrapeHorizon(withinHorizonDate))
      .toBe(false)
    expect(isDateBeyondScrapeHorizon(withinHorizonDate.format()))
      .toBe(false)
  })
})

describe('squishStatementsText', () => {
  const statements = [
    { text: 'Hello  world!' },
    { text: 'Hello   world!' },
    { text: 'Hello\nworld!' },
  ]
  it('Should replace repeated whitespace sequences with single spaces in statement text', () => {
    const squishedStatements = squishStatementsText(statements)
    squishedStatements.forEach((statement) => {
      expect(statement.text).toBe('Hello world!')
    })
  })
})

describe('filterPreviouslyScrapedStatements', () => {
  const statements = [
    {
      text: 'Hello  world!',
      wasPreviouslyScraped: false,
    },
    {
      text: 'Was scraped',
      wasPreviouslyScraped: true,
    },
  ]
  it('Should remove previously scraped statements', () => {
    const filteredStatements = filterPreviouslyScrapedStatements(statements)
    filteredStatements.forEach((statement) => {
      expect(statement.wasPreviouslyScraped).toBe(false)
    })
  })
})

describe('getUniqueCanonicalUrls', () => {
  const statements = [
    {
      text: 'Hello world!',
      canonicalUrl: 'https://example.com',
    },
    {
      text: 'Hello again world!',
      canonicalUrl: 'https://example.com',
    },
    {
      text: 'Hello chicken!',
      canonicalUrl: 'https://example.net',
    },
  ]
  it('Should remove previously scraped statements', () => {
    expect(getUniqueCanonicalUrls(statements).sort())
      .toEqual(['https://example.com', 'https://example.net'].sort())
  })
})
