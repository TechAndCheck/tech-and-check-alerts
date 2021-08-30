import nock from 'nock'
import fs from 'fs'
import path from 'path'

import CnnTranscriptListCrawler from '../CnnTranscriptListCrawler'

describe('CnnTranscriptListCrawler', () => {
  describe('run', () => {
    it('CnnTranscriptListCrawler should return urls', async () => {
      const portalMock = fs.readFileSync(path.resolve(__dirname, 'data/transcriptListMock.html'), 'utf8')
      nock('http://transcripts.cnn.com')
        .get('/date/2021-08-23')
        .reply(200, portalMock)

      const cnnTranscriptListCrawler = new CnnTranscriptListCrawler('/date/2021-08-23')
      const urls = await cnnTranscriptListCrawler.run()
      expect(Array.isArray(urls)).toBe(true)
      expect(urls).toHaveLength(48)
    })
  })
})
