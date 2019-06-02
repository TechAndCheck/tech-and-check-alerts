import {
  extractUrl,
  extractUrls,
} from '../crawler'

describe('extractUrl', () => {
  it('Should extract urls from anchor tags', () => {
    expect(extractUrl('<a href="google.com"></a>'))
      .toBe('google.com')
  })
})

describe('extractUrls', () => {
  it('Should extract a single url from an anchor tag', () => {
    expect(extractUrls('<a href="google.com"></a>'))
      .toEqual(['google.com'])
  })

  it('Should extract multiple urls from multiple anchor tags', () => {
    expect(extractUrls('<a href="google.com"></a><a href="cnn.com"></a>'))
      .toEqual(['google.com', 'cnn.com'])
  })
})
