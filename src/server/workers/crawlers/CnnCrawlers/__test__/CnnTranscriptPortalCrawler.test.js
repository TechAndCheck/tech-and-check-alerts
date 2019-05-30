import AbstractCrawler from '../../AbstractCrawler'
import CnnTranscriptPortalCrawler from '../CnnTranscriptPortalCrawler'

const crawler = new CnnTranscriptPortalCrawler()

describe('CnnTranscriptPortalCrawler', () => {
  it('Should extend AbstractCrawler', () => {
    expect(crawler).toBeInstanceOf(AbstractCrawler)
  })
})
