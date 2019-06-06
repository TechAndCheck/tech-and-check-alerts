
export const isTranscriptListUrl = url => url.startsWith('/TRANSCRIPTS/')
  && url.endsWith('.html')

export const isTranscriptUrl = url => url.startsWith('/TRANSCRIPTS/')
  && url.endsWith('.html')

export const getFullCnnUrl = (url) => {
  if (url.startsWith('http')) return url
  if (url.startsWith('/')) return `http://cnn.com${url}`
  return `http://cnn.com/${url}`
}
