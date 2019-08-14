import dayjs from 'dayjs'
import {
  isDateBeforeScrapeHorizon,
} from '../scraper'

import config from '../../config'

describe('isDateBeforeScrapeHorizon', () => {
  const day = dayjs()
  it('Should recognize dates before the date horizon', () => {
    const earlyDate = day.subtract(config.SCRAPE_DAY_HORIZON + 1, 'day')
    expect(isDateBeforeScrapeHorizon(earlyDate))
      .toBe(true)
  })
  it('Should recognize dates after the date horizon', () => {
    const earlyDate = day.add(1, 'day')
    expect(isDateBeforeScrapeHorizon(earlyDate))
      .toBe(false)
  })
})
