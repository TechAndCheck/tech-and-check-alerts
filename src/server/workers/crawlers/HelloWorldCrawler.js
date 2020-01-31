import AbstractCrawler from './AbstractCrawler'
import { extractUrls } from '../../utils/crawler'

class HelloWorldCrawler extends AbstractCrawler {
  constructor() {
    super('https://example.com')
  }

  crawlHandler = responseString => extractUrls(responseString)
}

export default HelloWorldCrawler
