import dayjs from 'dayjs'
import config from '../config'
import { squish } from '.'

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

/**
 * Squish (collapse repeated whitespace to a single space) statement text.
 *
 * @param  {Object[]} statements Array of statement objects
 * @return {Object[]}            Statements objects with their `text` properties squished
 */
export const squishStatementsText = statements => statements.map(statement => ({
  ...statement,
  text: squish(statement.text),
}))


/**
 * Remove statements that had been previously scraped from a list of statements
 * @param  {Object[]} statements The list of statements that we want to filter.
 * @return {Object[]}            The filtered list of statements
 */
export const filterPreviouslyScrapedStatements = statements => statements.filter(
  statement => !statement.wasPreviouslyScraped,
)

/**
 * Returns an array of unique canonical urls from a list of statements
 * @param  {Object[]} statements The statements to process
 * @return {String[]}            The unique canonical urls represented in the statements
 */
export const getUniqueCanonicalUrls = (statements) => {
  const uniqueUrlSet = new Set(
    statements.map(statement => statement.canonicalUrl),
  )
  return [...uniqueUrlSet]
}
