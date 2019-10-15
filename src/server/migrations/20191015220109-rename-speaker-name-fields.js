import { runPromiseSequence } from '../utils'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize
    .transaction(t => runPromiseSequence([
      () => queryInterface.renameColumn(
        'claims',
        'speaker_name',
        'speaker_normalized_name',
        { transaction: t },
      ),
      () => queryInterface.addColumn(
        'claims',
        'speaker_extracted_name',
        Sequelize.STRING(1024),
        { transaction: t },
      ),
    ])),

  down: queryInterface => queryInterface.sequelize
    .transaction(t => runPromiseSequence([
      () => queryInterface.renameColumn(
        'claims',
        'speaker_normalized_name',
        'speaker_name',
        { transaction: t },
      ),
      () => queryInterface.removeColumn('claims', 'speaker_extracted_name', { transaction: t }),
    ])),
}
