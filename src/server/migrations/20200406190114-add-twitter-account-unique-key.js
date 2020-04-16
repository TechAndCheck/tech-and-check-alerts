import { runPromiseSequence } from '../utils'

module.exports = {
  up: queryInterface => queryInterface.sequelize
    .transaction(t => runPromiseSequence([
      () => queryInterface.addConstraint(
        'twitter_accounts',
        ['screen_name', 'list_name'],
        {
          type: 'unique',
          name: 'screen_name_list_name',
        },
        { transaction: t },
      ),
    ])),
  down: queryInterface => queryInterface.removeConstraint(
    'twitter_accounts',
    'screen_name_list_name',
  ),
}
