import TwitterAccountStatementScraper from '../server/workers/scrapers/TwitterAccountStatementScraper'
import { isTwitterScreenName } from '../server/utils/twitter'
import logger from '../server/utils/logger'

const getTwitterScreenName = () => {
  const screenNameFlag = process.argv.indexOf('-s')
  if (screenNameFlag !== -1) {
    const screenName = process.argv[screenNameFlag + 1]
    if (isTwitterScreenName(screenName)) return screenName
  }
  return null
}

const screenName = getTwitterScreenName()
if (!screenName) {
  logger.error('Pass in a valid Twitter screen name with the `-s` parameter.')
  process.exit()
}

const scrapeStatements = () => {
  const scraper = new TwitterAccountStatementScraper(screenName)
  return scraper.run()
}

scrapeStatements().catch((error) => {
  logger.error(`Scraping failed. ${error}`)
}).then((statements) => {
  logger.info(`Total statements: ${statements.length}`)
  statements.forEach(statement => logger.info('%o', statement))
  process.exit()
})
