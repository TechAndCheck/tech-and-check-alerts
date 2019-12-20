// import { runPromiseSequence } from '../utils'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'twitter_accounts',
    'screen_name',
    Sequelize.CITEXT(128),
  ),
  down: (queryInterface, Sequelize) => queryInterface.changeColumn(
    'twitter_accounts',
    'screen_name',
    Sequelize.STRING(128),
  ),
  // up: (queryInterface, Sequelize) => queryInterface.sequelize
  //   .transaction(t => runPromiseSequence([
  //     () => queryInterface.sequelize.query(
  //       'CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA public;',
  //       { transaction: t },
  //     ),
  //     () => queryInterface.changeColumn(
  //       'twitter_accounts',
  //       'screen_name',
  //       Sequelize.CITEXT(128),
  //       { transaction: t },
  //     ),
  //   ])),
  // down: (queryInterface, Sequelize) => queryInterface.sequelize
  //   .transaction(t => runPromiseSequence([
  //     () => queryInterface.changeColumn(
  //       'twitter_accounts',
  //       'screen_name',
  //       Sequelize.STRING(128),
  //       { transaction: t },
  //     ),
  //     () => queryInterface.sequelize.query(
  //       'DROP EXTENSION IF EXISTS citext RESTRICT;',
  //       { transaction: t },
  //     ),
  //   ])),
}
