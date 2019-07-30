import { runPromiseSequence } from '../utils'

module.exports = {
  up: (queryInterface, Sequelize) => runPromiseSequence([
    () => queryInterface.addColumn(
      'claims',
      'scraper_code',
      Sequelize.STRING,
    ),
    () => queryInterface.addColumn(
      'claims',
      'source',
      Sequelize.STRING,
    ),
    () => queryInterface.renameColumn(
      'claims',
      'source_url',
      'canonical_url',
    ),
  ]),

  down: queryInterface => runPromiseSequence([
    () => queryInterface.removeColumn(
      'claims',
      'scraper_code',
    ),
    () => queryInterface.removeColumn(
      'claims',
      'source',
    ),
    () => queryInterface.renameColumn(
      'claims',
      'canonical_url',
      'source_url',
    ),
  ]),
}
