import cheerio from 'cheerio'

export const extractUrl = elem => cheerio(elem).attr('href')

export const extractUrls = (html) => {
  const $ = cheerio.load(html)
  return $('a')
    .map((i, elem) => extractUrl(elem))
    .get()
}
