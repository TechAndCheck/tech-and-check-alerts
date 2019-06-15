import CnnTranscriptStatementScraper from '../../workers/scrapers/CnnTranscriptStatementScraper'

export default async (job) => {
  const {
    data: {
      url,
    },
  } = job
  const scraper = new CnnTranscriptStatementScraper(url)
  const statements = await scraper.run()
  return statements
}
