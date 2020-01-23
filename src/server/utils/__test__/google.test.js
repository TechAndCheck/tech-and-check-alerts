import {
  getSpreadsheetCsvUrl,
  parseCsvString,
} from '../google'

describe('getSpreadsheetCsvUrl', () => {
  it('Should return a google URL for an ID', () => {
    expect(getSpreadsheetCsvUrl('a-google-document-id'))
      .toBe('https://docs.google.com/spreadsheets/d/a-google-document-id/export?format=csv')
  })
})

describe('parseCsvString', () => {
  test('Should parse a CSV from a string', () => parseCsvString('1,2,3\na,b,c').then(data => expect(data)
    .toEqual([['1', '2', '3'], ['a', 'b', 'c']])))

  test('Should parse a CSV with headers from a string', () => parseCsvString(
    'first,second,third\n1,2,3\na,b,c',
    true,
  ).then(data => expect(data)
    .toEqual([
      {
        first: '1',
        second: '2',
        third: '3',
      },
      {
        first: 'a',
        second: 'b',
        third: 'c',
      },
    ])))
})
