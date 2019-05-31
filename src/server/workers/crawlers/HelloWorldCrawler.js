import AbstractCrawler from './AbstractCrawler'
import { extractUrls } from '../../utils/crawler'

class HelloWorldCrawler extends AbstractCrawler {
  constructor() {
    super('https://google.com')
  }

  crawlHandler = responseString => extractUrls(responseString)
}

export default HelloWorldCrawler
