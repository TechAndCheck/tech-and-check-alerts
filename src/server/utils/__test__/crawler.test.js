import {
  extractUrl,
  extractUrls,
} from '../crawler'

describe('extractUrl', () => {
  it('Should extract URLs from anchor tags', () => {
    expect(extractUrl('<a href="example.com"></a>'))
      .toBe('example.com')
  })
})

describe('extractUrls', () => {
  it('Should extract a single URLs from an anchor tag', () => {
    expect(extractUrls('<a href="example.com"></a>'))
      .toEqual(['example.com'])
  })

  it('Should extract multiple URLs from multiple anchor tags', () => {
    expect(extractUrls('<a href="example.com"></a><a href="example.net"></a>'))
      .toEqual(['example.com', 'example.net'])
  })
})
