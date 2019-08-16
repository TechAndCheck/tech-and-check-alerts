import dayjs from 'dayjs'
import {
  isDateBeyondScrapeHorizon,
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
