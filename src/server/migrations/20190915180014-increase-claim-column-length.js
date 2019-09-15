import { runPromiseSequence } from '../utils'

module.exports = {
  up: (queryInterface, Sequelize) => runPromiseSequence([
    () => queryInterface.changeColumn(
      'claims',
      'source',
      Sequelize.STRING(1024),
    ),
    () => queryInterface.changeColumn(
      'claims',
      'speaker_name',
      Sequelize.STRING(1024),
    ),
    () => queryInterface.changeColumn(
      'claims',
      'speaker_affiliation',
      Sequelize.STRING(1024),
    ),
  ]),

  down: (queryInterface, Sequelize) => runPromiseSequence([
    () => queryInterface.changeColumn(
      'claims',
      'source',
      Sequelize.STRING,
    ),
    () => queryInterface.changeColumn(
      'claims',
      'speaker_name',
      Sequelize.STRING,
    ),
    () => queryInterface.changeColumn(
      'claims',
      'speaker_affiliation',
      Sequelize.STRING,
    ),
  ]),
}
