import { runPromiseSequence } from '../utils'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize
    .transaction(transaction => runPromiseSequence([
      () => queryInterface.addColumn(
        'twitter_accounts',
        'twitter_account_list_id',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'twitter_account_lists',
            key: 'id',
          },
        },
        { transaction },
      ),
      () => queryInterface.sequelize.query(
        `
        UPDATE twitter_accounts
        SET    twitter_account_list_id = (
          SELECT twitter_account_lists.id
          FROM   twitter_account_lists
          WHERE  twitter_account_lists.name = twitter_accounts.list_name
          LIMIT  1
        )`,
        { transaction },
      ),
      () => queryInterface.removeColumn(
        'twitter_accounts',
        'list_name',
        { transaction },
      ),
      () => queryInterface.addConstraint(
        'twitter_accounts',
        ['screen_name', 'twitter_account_list_id'],
        {
          type: 'unique',
          name: 'screen_name_twitter_account_list_id',
          transaction,
        },
      ),
    ])),

  down: (queryInterface, Sequelize) => queryInterface.sequelize
    .transaction(transaction => runPromiseSequence([
      () => queryInterface.addColumn(
        'twitter_accounts',
        'list_name',
        {
          type: Sequelize.STRING(128),
        },
        { transaction },
      ),
      () => queryInterface.addConstraint(
        'twitter_accounts',
        ['screen_name', 'list_name'],
        {
          type: 'unique',
          name: 'screen_name_list_name',
          transaction,
        },
      ),
      () => queryInterface.sequelize.query(
        `
        UPDATE twitter_accounts
        SET    list_name = (
          SELECT twitter_account_lists.name
          FROM   twitter_account_lists
          WHERE  twitter_account_lists.id = twitter_accounts.twitter_account_list_id
          LIMIT  1
        )`,
        { transaction },
      ),
      () => queryInterface.removeColumn(
        'twitter_accounts',
        'twitter_account_list_id',
        { transaction },
      ),
    ])),
}
