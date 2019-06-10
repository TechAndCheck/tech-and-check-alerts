import {
  isTranscriptListUrl,
  isTranscriptUrl,
  getFullCnnUrl,
} from '../cnn'

describe('isTranscriptListUrl', () => {
  it('Should not improperly identify transcript list urls', () => {
    expect(isTranscriptListUrl('http://google.com'))
      .toBe(false)
  })
  it('Should identify transcript list urls', () => {
    expect(isTranscriptListUrl('/TRANSCRIPTS/2019.06.01.html'))
      .toBe(true)
  })
})

describe('isTranscriptUrl', () => {
  it('Should not improperly identify transcript urls', () => {
    expect(isTranscriptUrl('http://google.com'))
      .toBe(false)
  })
  it('Should identify transcript list urls', () => {
    expect(isTranscriptUrl('/TRANSCRIPTS/1906/01/cnr.20.html'))
      .toBe(true)
  })
})

describe('getFullCnnUrl', () => {
  it('Should not modify a complete url', () => {
    expect(getFullCnnUrl('http://google.com'))
      .toBe('http://google.com')
    expect(getFullCnnUrl('http://cnn.com'))
      .toBe('http://cnn.com')
  })
  it('Should prepend a relative url', () => {
    expect(getFullCnnUrl('TRANSCRIPTS'))
      .toBe('http://cnn.com/TRANSCRIPTS')
  })
  it('Should prepend a relative url starting with /', () => {
    expect(getFullCnnUrl('/TRANSCRIPTS'))
      .toBe('http://cnn.com/TRANSCRIPTS')
  })
})
