import { runPromiseSequence } from '../utils'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize
    .transaction(t => runPromiseSequence([
      () => queryInterface.createTable(
        'known_speakers',
        {
          id: {
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          first_name: {
            type: Sequelize.STRING,
          },
          last_name: {
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
      () => queryInterface.addIndex(
        'known_speakers',
        ['last_name', 'first_name'],
        { transaction: t },
      ),
    ])),
  down: queryInterface => queryInterface.dropTable('known_speakers'),
}
