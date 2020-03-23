import nock from 'nock'
import fs from 'fs'
import path from 'path'

import GoogleSpreadsheetScraper from '../GoogleSpreadsheetScraper'

describe('GoogleSpreadsheetScraper', () => {
  describe('run', () => {
    it('GoogleSpreadsheetScraper should fetch the csv', async () => {
      const spreadsheetMock = fs.readFileSync(path.resolve(__dirname, 'data/spreadsheetMock.csv'), 'utf8')
      nock('https://docs.google.com')
        .get(/.*/)
        .reply(200, spreadsheetMock)

      const spreadsheetScraper = new GoogleSpreadsheetScraper('FakeDocumentId123')
      const result = await spreadsheetScraper.run()
      expect(result).toMatchSnapshot()
    })
  })
})
