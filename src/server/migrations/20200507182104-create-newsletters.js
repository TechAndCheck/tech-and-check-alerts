import { runPromiseSequence } from '../utils'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize
    .transaction(t => runPromiseSequence([
      () => queryInterface.createTable(
        'newsletters',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          label: {
            type: Sequelize.STRING,
          },
          mailing_list_address: {
            type: Sequelize.STRING,
          },
          template_name: {
            type: Sequelize.STRING,
          },
          text_template_name: {
            type: Sequelize.STRING,
          },
          template_settings: {
            type: Sequelize.JSON,
          },
          subject_decoration: {
            type: Sequelize.STRING,
          },
          enabled_media: {
            type: Sequelize.JSON,
          },
          claim_limit: {
            type: Sequelize.INTEGER,
          },
          twitter_account_list_id: {
            type: Sequelize.INTEGER,
            references: {
              model: 'twitter_account_lists',
              key: 'id',
            },
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
      () => queryInterface.addConstraint(
        'newsletters',
        ['label'],
        {
          type: 'unique',
          name: 'unique_label',
          transaction: t,
        },
      ),
    ])),
  down: queryInterface => queryInterface.dropTable('newsletters'),
}
