import logger from '../../utils/logger'
import models from '../../models'
import { ClaimBusterClaimDetector } from '../../workers/claimDetectors'

const { Claim } = models

const saveClaim = async claim => Claim.create({
  content: claim.text,
  claimBusterScore: claim.score,
  speakerName: claim.speaker.name,
  speakerAffiliation: claim.speaker.affiliation,
  canonicalUrl: claim.canonicalUrl,
  scraperName: claim.scraperName,
  source: claim.source,
  claimedAt: claim.claimedAt,
})

export default async (job) => {
  const {
    data: {
      statement,
    },
  } = job
  logger.info(`Extracting claims from statement: ${statement.text}`)
  const claimDetector = new ClaimBusterClaimDetector(statement)
  const claims = await claimDetector.getClaims()
  logger.info(`Total claims extracted: ${claims.length}`)

  claims.forEach(saveClaim)
  return claims
}
