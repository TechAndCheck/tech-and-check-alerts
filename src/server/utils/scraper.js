// Disabling because we intend to have more exports in the future.
/* eslint-disable import/prefer-default-export */
import dayjs from 'dayjs'
import config from '../config'

/**
 * Determine if a date is within or beyond the configured horizon (i.e., a number of days ago).
 *
 * Since the parameter is passed straight to the `Dayjs#isAfter()` comparitor, this function
 * accepts the same data types that `isAfter()` does.
 *
 * @param  {Dayjs|String} date The date you want to compare to the horizon
 * @return {Boolean}
 */
export const isDateBeyondScrapeHorizon = date => dayjs()
  .subtract(config.SCRAPE_DAY_HORIZON, 'day')
  .isAfter(date)
