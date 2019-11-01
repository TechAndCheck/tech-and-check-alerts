import { getBestSpeakerName } from '../speaker'

describe('getBestSpeakerName', () => {
  it('Should choose the best name between extracted and normalized names', () => {
    expect(getBestSpeakerName({
      extractedName: 'REPRESENTATIVE DONNA BUTTERS',
      affiliation: '',
      normalizedName: 'DONNA BUTTERS',
    }))
      .toEqual('DONNA BUTTERS')
  })
})
