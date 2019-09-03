import {
  runSequence,
  squish,
} from '.'
import {
  CLAIMBUSTER_THRESHHOLD,
  CLAIMBUSTER_API_VERSIONS,
} from '../workers/claimDetectors/constants'

export const filterWeakClaims = claimBusterResults => claimBusterResults
  .filter(result => result.score > CLAIMBUSTER_THRESHHOLD)

export const isValidApiVersion = version => Object
  .keys(CLAIMBUSTER_API_VERSIONS).includes(version)

const removeUnfriendlyCharacters = string => string.replace(/\//g, '')

/**
 * This cleans up statement text to match ClaimBuster API requirements.
 *
 * This method will change as the integration with ClaimBuster is updated.
 *
 * @param  {String} statementText The raw statement text to be passed to ClaimBuster
 * @return {String}               The sanitized, ClaimBuster friendly statement text
 */
export const cleanTextForClaimBuster = statementText => runSequence(
  [
    removeUnfriendlyCharacters,
    squish,
  ],
  statementText,
)
