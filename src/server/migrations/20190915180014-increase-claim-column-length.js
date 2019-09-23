import { runPromiseSequence } from '../utils'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize
    .transaction(t => runPromiseSequence([
      () => queryInterface.changeColumn(
        'claims',
        'source',
        Sequelize.STRING(1024),
        { transaction: t },
      ),
      () => queryInterface.changeColumn(
        'claims',
        'speaker_name',
        Sequelize.STRING(1024),
        { transaction: t },
      ),
      () => queryInterface.changeColumn(
        'claims',
        'speaker_affiliation',
        Sequelize.STRING(1024),
        { transaction: t },
      ),
    ])),
  down: (queryInterface, Sequelize) => queryInterface.sequelize
    .transaction(t => runPromiseSequence([
      () => queryInterface.changeColumn(
        'claims',
        'source',
        Sequelize.STRING,
        { transaction: t },
      ),
      () => queryInterface.changeColumn(
        'claims',
        'speaker_name',
        Sequelize.STRING,
        { transaction: t },
      ),
      () => queryInterface.changeColumn(
        'claims',
        'speaker_affiliation',
        Sequelize.STRING,
        { transaction: t },
      ),
    ])),
}
