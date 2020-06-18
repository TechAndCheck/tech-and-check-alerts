import { runPromiseSequence } from '../utils'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize
    .transaction(t => runPromiseSequence([
      () => queryInterface.createTable(
        'twitter_account_lists',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          name: {
            type: Sequelize.STRING,
          },
          google_doc_id: {
            type: Sequelize.STRING,
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
    ])),
  down: queryInterface => queryInterface.dropTable('twitter_account_lists'),
}
