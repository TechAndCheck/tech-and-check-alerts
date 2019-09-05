// Disabling because we intend to have more exports in the future.
/* eslint-disable import/prefer-default-export */

import { CLAIMBUSTER_THRESHHOLD } from '../constants'

export const filterWeakClaims = claimBusterResults => claimBusterResults
  .filter(result => result.score > CLAIMBUSTER_THRESHHOLD)
