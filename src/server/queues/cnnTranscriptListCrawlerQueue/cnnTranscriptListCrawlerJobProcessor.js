import { CnnTranscriptListCrawler } from '../../workers/crawlers/CnnCrawlers'

export default async (job) => {
  const {
    data: {
      url,
    },
  } = job
  const crawler = new CnnTranscriptListCrawler(url)
  const crawlResults = await crawler.run()
  return crawlResults
}
