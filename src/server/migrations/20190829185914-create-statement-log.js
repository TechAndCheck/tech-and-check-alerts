import { runPromiseSequence } from '../utils'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize
    .transaction(t => runPromiseSequence([
      () => queryInterface.createTable(
        'statement_logs',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          scraper_name: {
            type: Sequelize.STRING,
          },
          canonical_url: {
            type: Sequelize.STRING(1024),
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
          },
        },
        { transaction: t },
      ),
      () => queryInterface.addIndex(
        'statement_logs',
        ['scraper_name', 'canonical_url'],
        { transaction: t },
      ),
    ])),
  down: queryInterface => queryInterface.dropTable('statement_logs'),
}
