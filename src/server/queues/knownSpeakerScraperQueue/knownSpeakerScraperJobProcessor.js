import GoogleSpreadsheetScraper from '../../workers/scrapers/GoogleSpreadsheetScraper'
import logger from '../../utils/logger'
import models from '../../models'
import config from '../../config'
import { hasKey } from '../../utils'

const {
  sequelize,
  KnownSpeaker,
} = models

const isValidKnownSpeakerRow = row => (
  hasKey(row, 'first_name')
  && hasKey(row, 'last_name')
)

const extractKnownSpeakers = rows => rows
  .filter(isValidKnownSpeakerRow)
  .map(row => ({
    firstName: row.first_name,
    lastName: row.last_name,
  }))

const clearKnownSpeakers = async transaction => KnownSpeaker
  .destroy({
    truncate: true,
    restartIdentity: true,
  }, transaction)

const saveKnownSpeakers = (knownSpeakers, transaction) => KnownSpeaker.bulkCreate(
  knownSpeakers,
  transaction,
)

export default async () => {
  const documentId = config.KNOWN_SPEAKERS_GOOGLE_DOC_ID
  logger.info(`Syncing known speakers from Google doc: ${documentId}`)
  const scraper = new GoogleSpreadsheetScraper(documentId, true)
  const rows = await scraper.run()
  const knownSpeakers = extractKnownSpeakers(rows)
  logger.info(`Total speakers found: ${knownSpeakers.length}`)

  return sequelize.transaction(async (t) => {
    await clearKnownSpeakers(t)
    return saveKnownSpeakers(knownSpeakers, t)
  })
}
