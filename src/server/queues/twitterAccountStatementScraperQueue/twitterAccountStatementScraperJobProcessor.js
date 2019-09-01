import TwitterAccountStatementScraper from '../../workers/scrapers/TwitterAccountStatementScraper'
import claimBusterClaimDetectorQueueDict from '../claimBusterClaimDetectorQueue'
import { getQueueFromQueueDict } from '../../utils/queue'
import { filterPreviouslyScrapedStatements } from '../../utils/scraper'

const claimBusterClaimDetectorQueue = getQueueFromQueueDict(
  claimBusterClaimDetectorQueueDict,
)

const detectClaims = statement => claimBusterClaimDetectorQueue.add({ statement })

const detectClaimsForNewStatements = statements => filterPreviouslyScrapedStatements(statements)
  .forEach(detectClaims)

export default async (job) => {
  const {
    data: {
      screenName,
    },
  } = job
  const scraper = new TwitterAccountStatementScraper(screenName)
  const statements = await scraper.run()
  detectClaimsForNewStatements(statements)
  return statements
}
