import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'

dayjs.extend(customParseFormat)

/**
 * @typedef {Object} Speaker
 * @property {String} name
 * @property {String} affiliation
 */

/**
 * @typedef {Object} Statement
 * @property {Speaker} speaker The person who made the statement.
 * @property {String}  text    What the person actually said
 */

/**
 * These expressions are used in various utility methods
 * to identify special portions of scraped tex.
 */
const attributionAffiliationRegex = /,([^a-z]*)/
const attributionNameRegex = /[^a-z,]+/
const chunkAttributionRegex = /[^a-z]+[:]/

export const isTranscriptListUrl = url => url.startsWith('/TRANSCRIPTS/')
  && url.endsWith('.html')

export const isTranscriptUrl = url => url.startsWith('/TRANSCRIPTS/')
  && url.endsWith('.html')

export const getFullCnnUrl = (url) => {
  if (url.startsWith('http')) return url
  if (url.startsWith('/')) return `http://cnn.com${url}`
  return `http://cnn.com/${url}`
}

/**
 * Pull out the publication date from a passed transcript URL.
 *
 * If the URL is not a valid transcript URL, throw an error.
 *
 * @param  {String} url The transcript URL to parse
 * @return {Dayjs}      The extracted publication date
 */
export const extractPublicationDateFromTranscriptUrl = (url) => {
  if (!isTranscriptUrl(url)) {
    throw new Error(`Passed an invalid URL to extractPublicationDateFromTranscriptUrl: ${url}`)
  }
  const parts = url.split('/')
  const year = parts[2].substring(0, 2)
  const month = parts[2].substring(2)
  const day = parts[3]
  return dayjs(`${month}/${day}/${year}`, 'MM/DD/YY')
}

/**
 * CNN Transcripts have occasional timestamps inserted.
 * This will remove those timestamps.
 *
 * @param  {String} transcript The transcript we want to modify.
 * @return {String}            The modified transcript with timestamps removed.
 */
export const removeTimestamps = transcript => transcript
  .replace(/\s?\[\d\d:\d\d:\d\d\]/g, '')
  .trim()

/**
 * CNN transcripts have randomly inserted reminders of who is talking.
 * This will remove those reminders.
 *
 * @param  {String} transcript The transcript we want to modify.
 * @return {String}            The modified transcript with reminders removed.
 */
export const removeSpeakerReminders = transcript => transcript
  .replace(/\s*--\s*[A-Z\s]*:?\s*--/g, '')
  .trim()

/**
 * CNN transcripts sometimes have descriptors to indicate context
 * This will remove those descriptors.
 *
 * @param  {String} transcript The transcript we want to modify.
 * @return {String}            The modified transcript with descriptors removed.
 */
export const removeDescriptors = transcript => transcript
  .replace(/\s?\([A-Z\s]*\)/g, '')
  .replace(/\s?\(voice[\s-]*over\)/g, '')
  .replace(/\s?\(via telephone\)/g, '')
  .replace(/\s?\(on[\s-]camera\)/g, '')
  .replace(/\s?\(through[\s-]translator\)/g, '')
  .trim()

/**
 * Insert new lines in a transcript when the speaker has changed.
 *
 * @param  {String} transcript The transcript we want to modify.
 * @return {String}            The modified transcript with line breaks inserted.
 */
export const addBreaksOnSpeakerChange = transcript => transcript
  .replace(/([".?!)\]-]+)\s*([.,A-Z\s"'()-]*:)/g, '$1\n$2')

/**
 * Converts a transcript into a bunch of smaller pieces which can later be
 * processed into statements.
 *
 * @param  {String} transcript The transcript we want to parse.
 * @return {String[]}          The chunks of the transcript.
 */
export const splitTranscriptIntoChunks = transcript => transcript.split('\n')

/**
 * Extract the speaker name / affiliation from a chunk.
 *
 * @param  {String} chunk The segment of a transcript which contains a speaker and a statement.
 * @return {String}       The portion of the chunk that describes the person who was speaking.
 */
export const getAttributionFromChunk = chunk => (
  (chunk.match(chunkAttributionRegex)
  || [':'])[0]
    .slice(0, -1).trim()
)

/**
 * Extract the content of what was said from a chunk.
 *
 * @param  {String} chunk The segment of a transcript which contains a speaker and a statement.
 * @return {String}       The portion of the chunk that contains what was said.
 */
export const getTextFromChunk = chunk => chunk
  .replace(chunkAttributionRegex, '').trim()

/**
 * Extract the person's name from an attribution string.
 *
 * @param  {String} attribution The full string describing a person.
 * @return {String}             The portion of the attribution that contains the person's name
 */
export const getNameFromAttribution = attribution => (
  (attribution.match(attributionNameRegex)
  || [''])[0]
)

/**
 * Extract the person's affiliation from an attribution string.
 *
 * @param  {String} attribution The full string describing a person.
 * @return {String}             The portion of the attribution that contains
 *                                  the person's affiliation
 */
export const getAffiliationFromAttribution = attribution => (
  (attribution.match(attributionAffiliationRegex)
  || [','])[0]
    .substring(1)
    .trim()
)

/**
 * Extracts a statement object from a portion of a transcript.
 *
 * @param  {[type]} chunk The portion of a transcript containing a single statement
 * @return {Statement}    The statement object extracted from the chunk.
 */
export const extractStatementFromChunk = (chunk) => {
  const attribution = getAttributionFromChunk(chunk)
  const text = getTextFromChunk(chunk)
  const name = getNameFromAttribution(attribution)
  const affiliation = getAffiliationFromAttribution(attribution)

  return {
    speaker: {
      name,
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
export const extractStatementsFromChunks = chunks => chunks.map(
  extractStatementFromChunk,
)

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
      b => (a.name === b.name
        && a.affiliation === b.affiliation),
    )
    if (isUnique) {
      unique.push(a)
    }
    return unique
  }, [])
}

/**
 * Removes everything that isn't an actual name from a speaker name.
 *
 * @param  {String} name The name that needs to be cleaned.
 * @return {String}      The cleaned version of the name.
 */
export const cleanSpeakerName = name => name
  .replace('SENATOR ', '')
  .replace('REPRESENTATIVE ', '')
  .replace('SEN. ', '')
  .replace('REP. ', '')
  .replace(/\s*\([^()]*\)/g, '')
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
    newStatement.speaker.name = cleanSpeakerName(statement.speaker.name)
    return newStatement
  },
)

export const hasIdenticalName = (a, b) => a.name === b.name

/**
 * This method compares a candidate name with a starting name.
 * If the names are different, and if the candidate name explicitly
 * expands the speaker's name then it is considered an improvement.
 *
 * NOTE: this ONLY considering a names that explicitly add given names
 * for example JAMESON => JAMES JAMESON is considered an improvement, but
 * JAMES => JAMES JAMESON is not.
 *
 * @param  {String} a The speaker name we want to improve
 * @param  {String} b The candidate name for improvement
 * @return {bool}     True if the candidate name is an improvement
 */
export const improvesName = (a, b) => !hasIdenticalName(a, b)
  && a.name.endsWith(` ${b.name}`)


/**
 * This method compares a candidate affiliation with a starting affiliation.
 * If the starting affiliation is not empty it cannot be improved.  Likewise
 * if a candidate affiliation is empty it is not an improvement.
 *
 * @param  {String} a The speaker affiliation we want to improve
 * @param  {String} b The candidate affiliation for improvement
 * @return {bool}     True if the candidate affiliation is an improvement
 */
export const improvesAffiliation = (a, b) => a.affiliation.length !== 0
  && b.affiliation.length === 0

/**
 * This method compares a candidate speaker with the existing speaker
 * and, if both speakers seem to be referring to the same person it will
 * return which affiliation to use.
 *
 * @param  {Speaker} a The speaker we want to improve
 * @param  {Speaker} b The candidate for improvement
 * @return {String}    The best affiliation
 */
export const getBestAffiliation = (a, b) => (
  (improvesAffiliation(a, b)
  && (hasIdenticalName(a, b)
  || improvesName(a, b))) ? a.affiliation : b.affiliation
)

/**
 * This method compares a candidate speaker with the existing speaker
 * and, if both speakers seem to be referring to the same person it will
 * return which name to use.
 *
 * @param  {Speaker} a The speaker we want to improve
 * @param  {Speaker} b The candidate for improvement
 * @return {String}    The best name
 */
export const getBestName = (a, b) => (
  improvesName(a, b) ? a.name : b.name
)

/**
 * Normalize a speaker attributions with the most canonical version of that
 * attribution included in a list of all speakers seen so far.
 *
 * @param  {Speaker} speaker       The speaker that needs to be normalized.
 * @param  {Speaker[]} allSpeakers The full list of possible speaker values.
 * @return {Speaker}               The selected speaker.
 */
export const getNormalizedSpeaker = (speaker, allSpeakers) => allSpeakers
  .reduce((best, next) => {
    const newBest = Object.assign({}, best)
    if (improvesName(next, best)) {
      newBest.name = getBestName(next, speaker)
    }
    if (improvesName(next, best)
    || hasIdenticalName(next, best)) {
      newBest.affiliation = getBestAffiliation(next, speaker)
    }
    return newBest
  }, speaker)

/**
 * Normalizes all speakers in a set of statements so that the same
 * speaker maintains the same name and attribution even if the original
 * original transcript modified the names over time.
 *
 * @param  {Statement[]} statements The list of statements to normalize
 * @return {Statement[]}           The list of normalized statements
 */
export const normalizeStatementSpeakers = (statements) => {
  const speakers = getSpeakersFromStatements(statements)
  return statements.map(statement => Object.assign({}, statement, {
    speaker: getNormalizedSpeaker(statement.speaker, speakers),
  }))
}

export const removeNetworkAffiliatedStatements = statements => statements.filter(
  statement => !statement.speaker.affiliation.includes('CNN'),
)

export const removeUnattributableStatements = statements => statements.filter(
  statement => !statement.speaker.name.includes('UNIDENTIFIED'),
)
