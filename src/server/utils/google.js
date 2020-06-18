import parse from 'csv-parse'

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
