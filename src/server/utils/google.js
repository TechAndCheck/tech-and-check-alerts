import parse from 'csv-parse'
import { TWITTER_LIST_DOCUMENT_MAP } from '../constants'

export const getSpreadsheetCsvUrl = spreadsheetId => `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`

/**
 * Take a CSV string and return a parsed array.
 *
 * @param  {String}   googleCsvString The CSV string to be parsed.
 * @param  {bool}     columnHeaders true if the first row should be parsed as a column header.
 * @return {Array}    The parsed array of data from the CSV string.
 */
export const parseCsvString = async (googleCsvString, columnHeaders = false) => (
  new Promise((resolve, reject) => {
    const output = []
    parse(googleCsvString, {
      columns: columnHeaders,
    })
      .on('data', record => output.push(record))
      .on('error', error => reject(error))
      .on('end', () => resolve(output))
  })
)

/**
 * This method is strange, because ultimately this should all be database driven
 * We should quickly implement a table for this mapping.
 *
 * This method takes a twitter list name (which may be deprecated as a concept soon) and returns
 * the google document ID that contains the content of that list.
 *
 * @param  {String} listName The twitter list name
 * @return {String}          The associated google doc ID
 */
export const getDocumentIdByTwitterListName = listName => TWITTER_LIST_DOCUMENT_MAP[listName] || ''
