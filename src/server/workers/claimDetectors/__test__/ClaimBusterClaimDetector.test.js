import nock from 'nock'

import ClaimBusterClaimDetector from '../ClaimBusterClaimDetector'
import config from '../../../config'
import {
  CLAIMBUSTER_API_ROOT_URL,
  CLAIMBUSTER_THRESHHOLD,
} from '../../../constants'

/**
 * Converts a list of sentence / score tuples into a mocked claimbuster API response.
 * @param  {Array[Array[String, Integer]]} An array of sentence / score pairs.
 * @return {Object}                 The mocked API response.
 */
const mockClaimBusterResponse = scoredSentences => ({
  claim: scoredSentences.map(scoredSentence => scoredSentence[0]).join(' '),
  origin: '',
  results: scoredSentences.map((scoredSentence, i) => ({
    score: scoredSentence[1],
    index: i,
    text: scoredSentence[0],
  })),
})

const countScoresAboveClaimBusterThreshhold = scoredSentences => scoredSentences.reduce(
  (total, scoredSentence) => total + (scoredSentence[1] > CLAIMBUSTER_THRESHHOLD ? 1 : 0),
  0,
)

describe('ClaimBusterClaimDetector', () => {
  describe('getClaims', () => {
    it('ClaimBuster API call should include an API key in the header', async () => {
      nock(CLAIMBUSTER_API_ROOT_URL, {
        reqheaders: {
          'x-api-key': headerValue => headerValue === config.CLAIMBUSTER_API_KEY,
        },
      })
        .post('/score/text/')
        .reply(200, mockClaimBusterResponse([]))

      const claimBusterClaimDetector = new ClaimBusterClaimDetector('')
      await expect(claimBusterClaimDetector.getClaims())
        .resolves
        .not.toThrow()
    })

    it(`Should return only the claims that surpass the configured score threshhold (${CLAIMBUSTER_THRESHHOLD})`, async () => {
      const scoredSentences = [
        ['It would take 500 babies to eat 10 onions.', 0.7947227125364000],
        ['How many onions could 1000 babies eat?', 0.2172498345395903],
        ['Lets ensure at least one', CLAIMBUSTER_THRESHHOLD + 0.01],
      ]
      const totalClaimsAboveThreshhold = countScoresAboveClaimBusterThreshhold(scoredSentences)

      nock(CLAIMBUSTER_API_ROOT_URL)
        .post('/score/text/')
        .reply(200, mockClaimBusterResponse(scoredSentences))

      const claimBusterClaimDetector = new ClaimBusterClaimDetector(
        'It would take 500 babies to eat 10 onions. How many onions could 1000 babies eat?',
      )
      const claims = await claimBusterClaimDetector.getClaims()

      expect(Array.isArray(claims)).toBe(true)
      expect(claims).toHaveLength(totalClaimsAboveThreshhold)
    })
  })
})
