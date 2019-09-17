import rp from 'request-promise'

import config from '../../config'
import { filterWeakClaims } from '../../utils/claimBuster'
import { CLAIMBUSTER_API_ROOT_URL } from '../../constants'

class ClaimBusterClaimDetector {
  constructor(statement) {
    this.statement = statement
  }

  getClaims = async () => {
    const {
      speaker,
      text: statementText,
      canonicalUrl,
      scraperName,
      source,
      claimedAt,
    } = this.statement
    return rp
      .post({
        uri: `${CLAIMBUSTER_API_ROOT_URL}/score/text/`,
        headers: {
          'x-api-key': config.CLAIMBUSTER_API_KEY,
        },
        body: {
          input_text: statementText,
        },
        json: true,
      })
      .then(data => filterWeakClaims(data.results)
        .map(result => ({
          speaker,
          text: result.text,
          score: result.score,
          canonicalUrl,
          scraperName,
          source,
          claimedAt,
        })))
  }
}

export default ClaimBusterClaimDetector
