import AbstractCrawler from '../AbstractCrawler'

class HelloWorldCrawler extends AbstractCrawler {
  constructor() {
    super('https://google.com')
  }

  crawlHandler = (responseString) => {
    console.log(`Hello, I crawled ${responseString}`)
    return []
  }
}

export default HelloWorldCrawler
