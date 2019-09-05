import fs from 'fs'
import GenericScraper from '../server/workers/scrapers/GenericScraper'
import {
  isTranscriptUrl,
  getTranscriptTextFromHtml,
  removeTimestamps,
  removeSpeakerReminders,
  removeDescriptors,
  addBreaksOnSpeakerChange,
  splitTranscriptIntoChunks,
  extractStatementsFromChunks,
  cleanStatementSpeakerNames,
  normalizeStatementSpeakers,
  removeNetworkAffiliatedStatements,
  removeUnattributableStatements,
} from '../server/utils/cnn'
import logger from '../server/utils/logger'

const FILE_ENCODING = 'utf8'
const BASE_PATH = `${__dirname}/../server/utils/__test__/data/cnn`

const scrapeSequence = [
  getTranscriptTextFromHtml,
  removeTimestamps,
  removeSpeakerReminders,
  removeDescriptors,
  addBreaksOnSpeakerChange,
  splitTranscriptIntoChunks,
  extractStatementsFromChunks,
  cleanStatementSpeakerNames,
  normalizeStatementSpeakers,
  removeNetworkAffiliatedStatements,
  removeUnattributableStatements,
]

const getTestSuiteIndex = () => {
  const indexFlag = process.argv.indexOf('-i')
  if (indexFlag !== -1) {
    const suiteIndex = process.argv[indexFlag + 1]
    return suiteIndex
  }
  return null
}

const getUrl = () => {
  const urlFlag = process.argv.indexOf('-u')
  if (urlFlag !== -1) {
    const url = process.argv[urlFlag + 1]
    if (isTranscriptUrl(url)) {
      return url
    }
  }
  return null
}

const getTestSuiteDirectoryPath = suiteIndex => `${BASE_PATH}/${suiteIndex}`

const getTestSuiteUrlPath = (suiteIndex) => {
  const testSuiteDirectoryPath = getTestSuiteDirectoryPath(suiteIndex)
  return `${testSuiteDirectoryPath}/_url.txt`
}

const getTestSuiteStepPath = (suiteIndex, stepIndex, stepName) => `${getTestSuiteDirectoryPath(suiteIndex)}/${stepIndex}_${stepName}.json`

const getUrlFromTestSuite = (suiteIndex) => {
  try {
    return fs.readFileSync(getTestSuiteUrlPath(suiteIndex), FILE_ENCODING)
  } catch {
    return null
  }
}

// This method is a bit magic.  It gets a list of all existing files in the suites directory
// and then finds the file with the highest number name (index).
const getNextTestSuiteIndex = () => {
  const testSuiteIndexes = fs
    .readdirSync(BASE_PATH) // Get the files
    .map(fileName => parseInt(fileName, 10)) // Convert the names to numbers
    .filter(Number.isInteger) // Get rid of anything that wasn't a number
    .sort((a, b) => a - b) // Sort numerically
  return testSuiteIndexes.length === 0 ? 1 : testSuiteIndexes.slice(-1)[0] + 1
}

const createTestSuiteDirectory = (suiteIndex) => {
  const dirPath = getTestSuiteDirectoryPath(suiteIndex)
  try {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath)
    }
  } catch (e) {
    logger.error(e)
  }
}

const saveTestUrl = (suiteIndex, url) => {
  try {
    fs.writeFileSync(
      getTestSuiteUrlPath(suiteIndex),
      url,
      { encoding: FILE_ENCODING },
    )
  } catch (e) {
    logger.error(e)
  }
}

const saveTestStep = (suiteIndex, stepIndex, stepName, input, output) => {
  const testStepContent = {
    functionName: stepName,
    input,
    output,
  }
  const testStepPath = getTestSuiteStepPath(suiteIndex, stepIndex, stepName)
  try {
    fs.writeFileSync(
      testStepPath,
      JSON.stringify(testStepContent, null, 2),
      { encoding: FILE_ENCODING },
    )
  } catch (e) {
    logger.error(e)
  }
}

const generateTestSuiteFromSequence = (suiteIndex, sequence, seed) => sequence
  .reduce((param, fn, stepIndex) => {
    const result = fn(param)
    saveTestStep(
      suiteIndex,
      stepIndex + 1,
      fn.name,
      param,
      result,
    )
    return result
  }, seed)

const scrapeRawTranscript = (url) => {
  const scraper = new GenericScraper(url)
  return scraper.run()
}

const testSuiteIndex = getTestSuiteIndex()
const currentIndex = testSuiteIndex || getNextTestSuiteIndex()
const currentUrl = getUrl() || getUrlFromTestSuite(currentIndex)

if (!currentUrl) {
  logger.error('Pass in a valid CNN transcript URL with the `-u` parameter, or a suite index to re-run with the `-i` parameter')
  process.exit()
}

createTestSuiteDirectory(currentIndex)
saveTestUrl(currentIndex, currentUrl)
scrapeRawTranscript(currentUrl)
  .then(scrapeResult => generateTestSuiteFromSequence(currentIndex, scrapeSequence, scrapeResult))
  .catch(error => logger.error(`Scraping failed. ${error}`))
  .finally(() => process.exit())
