import parse from 'csv-parse'

export const getSpreadsheetCsvUrl = spreadsheetId => `https://docs.google.com/spreadsheets/d/${spreadsheetId}/export?format=csv`

export const parseCsvString = async googleCsvString => new Promise((resolve, reject) => {
  const output = []
  parse(googleCsvString)
    .on('data', record => output.push(record))
    .on('error', error => reject(error))
    .on('end', () => resolve(output))
})
