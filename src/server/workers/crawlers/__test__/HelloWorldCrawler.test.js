import HelloWorldCrawler from '../HelloWorldCrawler'

const crawler = new HelloWorldCrawler()

describe('HelloWorldCrawler', () => {
  it('Should have a crawl URL', () => {
    expect(crawler).toHaveProperty('crawlUrl')
    expect(crawler.crawlUrl).toMatch(/^http/)
  })
  it('Should have a crawl handler function', () => {
    expect(crawler).toHaveProperty('crawlHandler')
    expect(crawler.crawlHandler).toBeInstanceOf(Function)
  })
  it('Should have this totally fake property invented to annoy Travis CI', () => {
    expect(crawler).toHaveProperty('travisCI')
  })
})
