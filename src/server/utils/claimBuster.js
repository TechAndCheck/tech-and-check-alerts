/* eslint-disable import/prefer-default-export */
// We may export other things some day.

import { CLAIMBUSTER_THRESHHOLD } from '../constants'

export const filterWeakClaims = claimBusterResults => claimBusterResults
  .filter(result => result.score > CLAIMBUSTER_THRESHHOLD)
