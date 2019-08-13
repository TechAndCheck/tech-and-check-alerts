import { runPromiseSequence } from '../utils'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize
    .transaction(t => runPromiseSequence([
      () => queryInterface.createTable(
        'scrape_logs',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          scrape_url: {
            type: Sequelize.STRING,
          },
          scraper_name: {
            type: Sequelize.STRING,
          },
          result: {
            type: Sequelize.TEXT,
          },
          error: {
            type: Sequelize.TEXT,
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
        'scrape_logs',
        ['scraper_name', 'scrape_url'],
        { transaction: t },
      ),
    ])),
  down: queryInterface => queryInterface.dropTable('scrape_logs'),
}
