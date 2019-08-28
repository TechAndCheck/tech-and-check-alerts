import TwitterAccountStatementScraper from '../../workers/scrapers/TwitterAccountStatementScraper'
import claimBusterClaimDetectorQueueDict from '../claimBusterClaimDetectorQueue'
import { getQueueFromQueueDict } from '../../utils/queue'

const claimBusterClaimDetectorQueue = getQueueFromQueueDict(
  claimBusterClaimDetectorQueueDict,
)

const detectClaims = statement => claimBusterClaimDetectorQueue.add({ statement })

export default async (job) => {
  const {
    data: {
      screenName,
    },
  } = job
  const scraper = new TwitterAccountStatementScraper(screenName)
  const statements = await scraper.run()
  statements.forEach(detectClaims)
  return statements
}
