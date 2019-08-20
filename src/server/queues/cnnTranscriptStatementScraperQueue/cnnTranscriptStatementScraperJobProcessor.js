import CnnTranscriptStatementScraper from '../../workers/scrapers/CnnTranscriptStatementScraper'
import claimBusterClaimDetectorQueueDict from '../claimBusterClaimDetectorQueue'
import { getQueueFromQueueDict } from '../../utils/queue'

const claimBusterClaimDetectorQueue = getQueueFromQueueDict(
  claimBusterClaimDetectorQueueDict,
)

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
