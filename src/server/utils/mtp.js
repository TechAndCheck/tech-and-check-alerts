import cheerio from 'cheerio'
import dayjs from 'dayjs'

const $ = cheerio

export const isTranscriptUrl = url => (url.startsWith('/meet-the-press/')
  || url.startsWith('https://www.nbcnews.com/meet-the-press/')
  || url.startsWith('http://www.nbcnews.com/meet-the-press/'))

export const getFullMtpUrl = (url) => {
  if (url.startsWith('/')) return `http://www.nbcnews.com${url}`
  if (url.startsWith('http')) return url
  return `http://www.nbcnews.com/${url}`
}

/**
 * Pull out the publication date from a passed transcript URL.
 *
 * If the URL is not a valid transcript URL, throw an error.
 *
 * An example URL: https://www.nbcnews.com/meet-the-press/meet-press-november-15-2020-n1247868
 *
 * @param  {String} url The transcript URL to parse
 * @return {Dayjs}      The extracted publication date
 */
export const extractPublicationDateFromTranscriptUrl = (url) => {
  if (!isTranscriptUrl(url)) {
    throw new Error(`Passed an invalid URL to extractPublicationDateFromTranscriptUrl: ${url}`)
  }
  const parts = url.split('/')
  const subParts = parts[4]
    .split('-')
    .slice(-4)
  const year = subParts[2]
  const month = subParts[0]
  const day = subParts[1]
  return dayjs(`${month} ${day} ${year}`, 'MMMM DD YY')
}

/**
 * Extract transcript text from HTML that has been scraped from a Meet the Press transcript
 * @param  {String} html The raw html that was returned from a scrape
 * @return {String[]}    The pieces of transcript text from that html.
 */
export const getTranscriptChunksFromHtml = (html) => {
  const $chunkElements = $(html).find('.article-body__content p')
  const bodyTexts = $chunkElements.toArray().map(element => $(element).text())
  return bodyTexts
}

const isSpeakerChunk = chunk => chunk.endsWith(':')

/**
 * Meet the Press transcripts sometimes have descriptors to indicate context
 * This will remove those descriptors.
 *
 * @param  {String[]} transcriptChunks The transcript we want to modify.
 * @return {String[]}                  The modified transcript parts with descriptors removed.
 */
export const removeDescriptors = transcriptChunks => transcriptChunks
  .filter(chunk => !chunk.endsWith(']'))

/**
 * Extracts a statement object from a portion of a transcript.
 *
 * @param  {String[]}  chunkSet A set of chunks beginning with a speaker.
 * @return {Statement}          The statement object extracted from the chunks.
 */
export const extractStatementFromChunkSet = (chunkSet) => {
  if (chunkSet.length < 2) return null
  if (!isSpeakerChunk(chunkSet[0])) return null
  const attribution = chunkSet[0].slice(0, -1) // Remove the ":"
  const text = chunkSet.slice(1).join(' ')
  const extractedName = attribution // MTP attributions are just names
  const affiliation = '' // MTP doesn't have affiliations

  return {
    speaker: {
      extractedName,
      normalizedName: extractedName,
      affiliation,
    },
    text,
  }
}

/**
 * Converts a list of chunks into a list of statement objects.
 *
 * @param  {String[]} chunks The list of transcript chunks
 * @return {Statement[]}     The list of extracted statement objects
 */
export const extractStatementsFromChunks = (chunks) => {
  const statements = []
  chunks.reduce((chunkSet, chunk) => {
    if (isSpeakerChunk(chunk)) {
      const statement = extractStatementFromChunkSet(chunkSet)
      if (statement !== null) {
        statements.push(statement)
      }
      return [chunk]
    }
    chunkSet.push(chunk)
    return chunkSet
  }, [])
  return statements
}

/**
 * Returns a list of unique speakers from a list of statements
 *
 * @param  {Statement[]} statements The list of statement objects we want to process
 * @return {Speaker[]}              The list of unique speaker objects
 */
export const getSpeakersFromStatements = (statements) => {
  const speakers = statements.map(statement => statement.speaker)
  return speakers.reduce((unique, a) => {
    const isUnique = !unique.find(
      b => (a.normalizedName === b.normalizedName
        && a.affiliation === b.affiliation),
    )
    if (isUnique) {
      unique.push(a)
    }
    return unique
  }, [])
}

/**
 * Removes honorifics from a speaker name.
 *
 * @param  {String} speakerName The extracted name that needs to be cleaned.
 * @return {String}             The cleaned, normalized version of the name.
 */
const removeHonorifics = (speakerName) => {
  const honorifics = [
    'SENATOR',
    'SEN.',
    'REPRESENTATIVE',
    'REP.',
    'GOVERNOR',
    'GOV.',
    'GENERAL',
    'GEN.',
    'MAYOR',
    'FORMER',
    'FMR.',
  ]
  return honorifics.reduce((cleanedName, honorific) => {
    const rooted = new RegExp(`^${honorific} `)
    const middle = new RegExp(` ${honorific} `, 'g')
    return cleanedName.replace(rooted, '').replace(middle, ' ')
  }, speakerName)
}

/**
 * Removes everything that isn't an actual name from a speaker name.
 *
 * @param  {String} speakerName The name that needs to be cleaned.
 * @return {String}             The cleaned version of the name.
 */
export const cleanSpeakerName = speakerName => removeHonorifics(speakerName)
  .trim()

/**
 * Cleans all speaker names in a list of statements
 *
 * @param  {Statement[]} statements The list of statements to process
 * @return {Statement[]}            The cleaned list of statements
 */
export const cleanStatementSpeakerNames = statements => statements.map(
  (statement) => {
    const newStatement = Object.assign({}, statement)
    newStatement.speaker.normalizedName = cleanSpeakerName(statement.speaker.normalizedName)
    return newStatement
  },
)

export const removeUnattributableStatements = statements => statements.filter(
  statement => !statement.speaker.extractedName.includes('UNIDENTIFIED'),
)
