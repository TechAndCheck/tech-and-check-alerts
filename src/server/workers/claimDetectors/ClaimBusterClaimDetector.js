import rp from 'request-promise'
import { filterWeakClaims } from '../../utils/claimBuster'

class ClaimBusterClaimDetector {
  constructor(statement) {
    this.statement = statement
  }

  getClaims = async () => {
    const {
      speaker,
      text: statementText,
    } = this.statement
    const uri = `https://idir.uta.edu/factchecker/score_text/${statementText}`
    return rp
      .get({
        uri,
        json: true,
      })
      .then(data => filterWeakClaims(data.results)
        .map(result => ({
          speaker,
          text: result.text,
          score: result.score,
        })))
  }
}

export default ClaimBusterClaimDetector
