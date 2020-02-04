import nock from 'nock'
import fs from 'fs'
import path from 'path'

import CnnTranscriptListCrawler from '../CnnTranscriptListCrawler'

describe('CnnTranscriptListCrawler', () => {
  describe('run', () => {
    it('CnnTranscriptListCrawler should return urls', async () => {
      const portalMock = fs.readFileSync(path.resolve(__dirname, 'data/transcriptListMock.html'), 'utf8')
      nock('http://transcripts.cnn.com')
        .get('/TRANSCRIPTS/2020.01.21.html')
        .reply(200, portalMock)

      const cnnTranscriptListCrawler = new CnnTranscriptListCrawler('/TRANSCRIPTS/2020.01.21.html')
      const urls = await cnnTranscriptListCrawler.run()
      expect(Array.isArray(urls)).toBe(true)
      expect(urls).toHaveLength(55)
    })
  })
})
