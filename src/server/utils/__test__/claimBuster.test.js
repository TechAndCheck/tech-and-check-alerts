import {
  filterWeakClaims,
} from '../claimBuster'

import { CLAIMBUSTER_THRESHHOLD } from '../../constants'

describe('filterWeakClaims', () => {
  const dummyClaimData = [
    { score: 100 },
    { score: 90 },
    { score: 80 },
    { score: 70 },
    { score: 60 },
    { score: 50 },
    { score: 40 },
    { score: 30 },
    { score: 20 },
    { score: 10 },
    { score: 0 },
    { score: -1 },
  ]
  it(`Should remove claims that fall below ${CLAIMBUSTER_THRESHHOLD}`, () => {
    const results = filterWeakClaims(dummyClaimData)
    results.forEach(result => expect(result.score).toBeGreaterThan(CLAIMBUSTER_THRESHHOLD))
  })
  it(`Should keep claims that fall above ${CLAIMBUSTER_THRESHHOLD}`, () => {
    const results = filterWeakClaims(dummyClaimData)
    dummyClaimData.forEach((input) => {
      if (input.score > CLAIMBUSTER_THRESHHOLD) {
        expect(results).toContainEqual(input)
      }
    })
  })
})
