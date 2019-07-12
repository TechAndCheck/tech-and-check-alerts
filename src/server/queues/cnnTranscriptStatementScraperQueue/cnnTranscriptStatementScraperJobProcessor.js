import CnnTranscriptStatementScraper from '../../workers/scrapers/CnnTranscriptStatementScraper'
import claimBusterClaimDetectorQueueDict from '../claimBusterClaimDetectorQueue'

const claimBusterClaimDetectorQueue = claimBusterClaimDetectorQueueDict.factory.getQueue()

const detectClaims = statement => claimBusterClaimDetectorQueue.add({ statement })

export default async (job) => {
  const {
    data: {
      url,
    },
  } = job
  const scraper = new CnnTranscriptStatementScraper(url)
  const statements = await scraper.run()
  statements.forEach(detectClaims)
  return statements
}
