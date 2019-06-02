import HelloWorldCrawler from '../../workers/crawlers/HelloWorldCrawler'

export default () => {
  const crawler = new HelloWorldCrawler()
  const crawlResults = crawler.run()
  return Promise.resolve(crawlResults)
}
