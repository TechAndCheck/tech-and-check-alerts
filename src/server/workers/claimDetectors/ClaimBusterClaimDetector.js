import rp from 'request-promise'

import config from '../../config'
import logger from '../../utils/logger'
import {
  filterWeakClaims,
  cleanTextForClaimBuster,
  isValidApiVersion,
} from '../../utils/claimBuster'
import {
  CLAIMBUSTER_API_VERSIONS,
  CLAIMBUSTER_API_ROOT_URLS,
} from './constants'

class ClaimBusterClaimDetector {
  constructor(statement) {
    if (!isValidApiVersion(config.CLAIMBUSTER_API_VERSION)) {
      logger.warn('Valid ClaimBuster API version not configured; defaulting to V1.')
    }
    this.statement = statement
  }

  generateScoreTextUrl = (text) => {
    switch (config.CLAIMBUSTER_API_VERSION) {
      case CLAIMBUSTER_API_VERSIONS.V2:
        return `${CLAIMBUSTER_API_ROOT_URLS.V2}/score/text/${encodeURIComponent(text)}`
      case CLAIMBUSTER_API_VERSIONS.V1:
      default:
        return `${CLAIMBUSTER_API_ROOT_URLS.V1}/score_text/${
          encodeURIComponent(cleanTextForClaimBuster(text))
        }`
    }
  }

  generateRequestHeaders = () => {
    switch (config.CLAIMBUSTER_API_VERSION) {
      case CLAIMBUSTER_API_VERSIONS.V2:
        return {
          'x-api-key': config.CLAIMBUSTER_API_KEY,
        }
      case CLAIMBUSTER_API_VERSIONS.V1:
      default:
        return {}
    }
  }

  getClaims = async () => {
    const {
      speaker,
      text: statementText,
      canonicalUrl,
      scraperName,
      source,
    } = this.statement
    return rp
      .get({
        uri: this.generateScoreTextUrl(statementText),
        headers: this.generateRequestHeaders(),
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
