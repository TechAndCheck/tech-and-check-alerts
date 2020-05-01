import GoogleSpreadsheetScraper from '../../workers/scrapers/GoogleSpreadsheetScraper'
import logger from '../../utils/logger'
import models from '../../models'
import {
  decorateObjects,
  hasKey,
} from '../../utils'
import {
  extractScreenName,
  isTwitterScreenName,
} from '../../utils/twitter'
import { getDocumentIdByTwitterListName } from '../../utils/google'

const {
  sequelize,
  TwitterAccount,
} = models

const isTwitterDisplayNameColumn = columnName => /twitter_\d+/.test(columnName)
  || columnName === 'twitter_%d'

const extractTwitterScreenNameColumnsFromRow = row => Object.keys(row)
  .filter(isTwitterDisplayNameColumn)

const hasAtLeastOneTwitterScreenNameColumn = row => (
  extractTwitterScreenNameColumnsFromRow(row).length >= 1
)

const isValidTwitterAccountRow = row => (
  hasKey(row, 'display_name')
  && hasAtLeastOneTwitterScreenNameColumn(row)
)

const extractTwitterAccountsFromRow = (row, screenNameColumns) => {
  const screenNames = screenNameColumns
    .map(columnName => extractScreenName(row[columnName]))
    .filter(isTwitterScreenName)
  const twitterAccounts = screenNames.map(screenName => ({
    screenName,
    preferredDisplayName: row.display_name,
  }))
  return twitterAccounts
}

const extractTwitterAccountsFromRows = (rows, screenNameColumns) => rows
  .filter(isValidTwitterAccountRow)
  .map(row => extractTwitterAccountsFromRow(row, screenNameColumns))
  .reduce(
    (accumulator, twitterAccounts) => accumulator.concat(twitterAccounts),
    [],
  )

export default async (job) => {
  const {
    data: {
      listName,
    },
  } = job

  const documentId = getDocumentIdByTwitterListName(listName)
  logger.info(`Syncing twitter accounts for "${listName}" from Google doc: ${documentId}`)
  const scraper = new GoogleSpreadsheetScraper(documentId, true)
  const rows = await scraper.run()
  const screenNameColumns = extractTwitterScreenNameColumnsFromRow(rows[0] || {})
  const twitterAccounts = extractTwitterAccountsFromRows(rows, screenNameColumns)
  const decoratedTwitterAccounts = decorateObjects(
    twitterAccounts,
    {
      listName,
      isActive: true,
    },
  )
  logger.info(`Total accounts found: ${decoratedTwitterAccounts.length}`)
  return sequelize.transaction(async (transaction) => {
    await TwitterAccount.deactivateTwitterAccountsByList(listName, transaction)
    return TwitterAccount.createOrActivateTwitterAccounts(decoratedTwitterAccounts, transaction)
  })
}
