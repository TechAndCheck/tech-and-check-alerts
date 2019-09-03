import rp from 'request-promise'
import {
  filterWeakClaims,
  cleanTextForClaimBuster,
} from '../../utils/claimBuster'

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
    } = this.statement
    const urlSafeStatementText = encodeURIComponent(cleanTextForClaimBuster(statementText))
    const uri = `https://idir.uta.edu/factchecker/score_text/${urlSafeStatementText}`
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
          canonicalUrl,
          scraperName,
          source,
        })))
  }
}

export default ClaimBusterClaimDetector
