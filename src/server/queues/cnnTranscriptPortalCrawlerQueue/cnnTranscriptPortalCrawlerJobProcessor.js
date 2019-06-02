import { CnnTranscriptPortalCrawler } from '../../workers/crawlers/CnnCrawlers'

export default async () => {
  const crawler = new CnnTranscriptPortalCrawler()
  const crawlResults = await crawler.run()
  return crawlResults
}
