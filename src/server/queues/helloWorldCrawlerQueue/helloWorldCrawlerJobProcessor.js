import HelloWorldCrawler from '../../workers/crawlers/HelloWorldCrawler'

export default (job) => {
  console.log('Starting job:')
  console.log(job)
  const crawler = new HelloWorldCrawler()
  const crawlResults = crawler.run()
  return Promise.resolve(crawlResults)
}
