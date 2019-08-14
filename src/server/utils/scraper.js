// Disabling because we intend to have more exports in the future.
/* eslint-disable import/prefer-default-export */
import dayjs from 'dayjs'
import config from '../config'

export const isDateBeforeScrapeHorizon = date => dayjs()
  .subtract(config.SCRAPE_DAY_HORIZON, 'day')
  .isAfter(date)
