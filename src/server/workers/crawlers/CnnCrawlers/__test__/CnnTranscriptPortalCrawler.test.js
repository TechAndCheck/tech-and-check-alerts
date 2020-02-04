import nock from 'nock'
import fs from 'fs'
import path from 'path'

import CnnTranscriptPortalCrawler from '../CnnTranscriptPortalCrawler'

describe('CnnTranscriptPortalCrawler', () => {
  describe('run', () => {
    it('CnnTranscriptPortalCrawler should return urls', async () => {
      const portalMock = fs.readFileSync(path.resolve(__dirname, 'data/portalMock.html'), 'utf8')
      nock('http://transcripts.cnn.com')
        .get('/TRANSCRIPTS/')
        .reply(200, portalMock)

      const cnnTranscriptPortalCrawler = new CnnTranscriptPortalCrawler()
      const urls = await cnnTranscriptPortalCrawler.run()
      expect(Array.isArray(urls)).toBe(true)
      expect(urls).toHaveLength(46)
    })
  })
})
