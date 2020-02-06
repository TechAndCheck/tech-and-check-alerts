import nock from 'nock'
import fs from 'fs'
import path from 'path'

import CnnTranscriptStatementScraper from '../CnnTranscriptStatementScraper'

describe('CnnTranscriptStatementScraper', () => {
  describe('run', () => {
    it('CnnTranscriptStatementScraper should extract statements from a transcript', async () => {
      const transriptMock = fs.readFileSync(path.resolve(__dirname, 'data/CnnTranscriptStatementScraper/transcriptMock.html'), 'utf8')
      nock('http://transcripts.cnn.com')
        .get('/TRANSCRIPTS/2001/30/acd.01.html')
        .reply(200, transriptMock)

      const cnnTranscriptStatementScraper = new CnnTranscriptStatementScraper('/TRANSCRIPTS/2001/30/acd.01.html')
      const statements = await cnnTranscriptStatementScraper.run()
      statements.forEach(statement => expect(statement).toMatchSnapshot({
        claimedAt: expect.any(String),
        wasPreviouslyScraped: expect.any(Boolean),
      }))
    })
  })
})
