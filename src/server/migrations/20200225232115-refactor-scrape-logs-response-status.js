import { runPromiseSequence } from '../utils'

import { SCRAPE_RESPONSE_CODES } from '../workers/scrapers/constants'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize
    .transaction(t => runPromiseSequence([
      () => queryInterface.addColumn(
        'scrape_logs',
        'scrape_response_code',
        {
          type: Sequelize.STRING,
        },
        { transaction: t },
      ),
      () => queryInterface.addColumn(
        'scrape_logs',
        'scrape_response_message',
        {
          type: Sequelize.TEXT,
        },
        { transaction: t },
      ),
      () => queryInterface.sequelize.query(
        `
        UPDATE scrape_logs
        SET    scrape_response_code = '${SCRAPE_RESPONSE_CODES.HTTP_SUCCESS}'
        WHERE  result IS NOT NULL`,
        { transaction: t },
      ),
      () => queryInterface.sequelize.query(
        `
        UPDATE scrape_logs
        SET    scrape_response_code = COALESCE(
                 SUBSTRING(error from '^[0-9]{3}'),
                 '${SCRAPE_RESPONSE_CODES.NON_HTTP_ERROR}'
                ),
               scrape_response_message = error
        WHERE  error IS NOT NULL`,
        { transaction: t },
      ),
      () => queryInterface.removeColumn(
        'scrape_logs',
        'result',
        { transaction: t },
      ),
      () => queryInterface.removeColumn(
        'scrape_logs',
        'error',
        { transaction: t },
      ),
    ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize
    .transaction(t => runPromiseSequence([
      () => queryInterface.addColumn(
        'scrape_logs',
        'result',
        {
          type: Sequelize.TEXT,
        },
        { transaction: t },
      ),
      () => queryInterface.addColumn(
        'scrape_logs',
        'error',
        {
          type: Sequelize.TEXT,
        },
        { transaction: t },
      ),
      () => queryInterface.sequelize.query(
        `
        UPDATE scrape_logs
        SET    result = '${SCRAPE_RESPONSE_CODES.HTTP_SUCCESS}'
        WHERE  scrape_response_code = '${SCRAPE_RESPONSE_CODES.HTTP_SUCCESS}'`,
        { transaction: t },
      ),
      () => queryInterface.sequelize.query(
        `
        UPDATE scrape_logs
        SET    error = scrape_response_message
        WHERE  scrape_response_code != '${SCRAPE_RESPONSE_CODES.HTTP_SUCCESS}' OR
               scrape_response_code IS NULL`,
        { transaction: t },
      ),
      () => queryInterface.removeColumn(
        'scrape_logs',
        'scrape_response_code',
        { transaction: t },
      ),
      () => queryInterface.removeColumn(
        'scrape_logs',
        'scrape_response_message',
        { transaction: t },
      ),
    ])),
}
