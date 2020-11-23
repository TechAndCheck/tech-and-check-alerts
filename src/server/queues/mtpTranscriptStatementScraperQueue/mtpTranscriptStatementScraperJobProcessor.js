import MtpTranscriptStatementScraper from '../../workers/scrapers/MtpTranscriptStatementScraper'
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
  const scraper = new MtpTranscriptStatementScraper(url)
  const statements = await scraper.run()
  statements.forEach(detectClaims)
  return statements
}
