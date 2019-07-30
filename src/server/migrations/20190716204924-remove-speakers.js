import { runPromiseSequence } from '../utils'

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.sequelize
    .transaction(t => runPromiseSequence([
      () => queryInterface.addColumn(
        'claims',
        'speaker_name',
        Sequelize.STRING,
      ),
      () => queryInterface.addColumn(
        'claims',
        'speaker_affiliation',
        Sequelize.STRING,
      ),
      () => queryInterface.sequelize.query(
        `
        UPDATE claims as claims
        SET    speaker_name = speakers.full_name,
               speaker_affiliation = speakers.affiliation
        FROM   speakers
        WHERE  speakers.id = claims.speaker_id`,
        { transaction: t },
      ),
      () => queryInterface.removeColumn(
        'claims',
        'speaker_id',
        { transaction: t },
      ),
      () => queryInterface.dropTable(
        'speakers',
        { transaction: t },
      ),
    ])),

  down: (queryInterface, Sequelize) => queryInterface.sequelize
    .transaction(t => runPromiseSequence([
      () => queryInterface.createTable(
        'speakers',
        {
          id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER,
          },
          full_name: {
            type: Sequelize.STRING,
          },
          affiliation: {
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
      () => queryInterface.addColumn(
        'claims',
        'speaker_id',
        {
          type: Sequelize.INTEGER,
          references: {
            model: 'speakers',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
        },
        { transaction: t },
      ),
      () => queryInterface.sequelize.query(
        `
        INSERT INTO speakers
        (
          full_name,
          affiliation,
          created_at,
          updated_at
        )
        SELECT
        DISTINCT claims.speaker_name as speaker_name,
                 claims.speaker_affiliation as speaker_affiliation,
                 NOW(),
                 NOW()
        FROM     claims
        `,
        { transaction: t },
      ),
      () => queryInterface.sequelize.query(
        `
        UPDATE claims
        SET    speaker_id = speakers.id
        FROM   speakers
        WHERE  speakers.full_name = claims.speaker_name
        AND    speakers.affiliation = claims.speaker_affiliation
        `,
        { transaction: t },
      ),
      () => queryInterface.removeColumn(
        'claims',
        'speaker_name',
        { transaction: t },
      ),
      () => queryInterface.removeColumn(
        'claims',
        'speaker_affiliation',
        { transaction: t },
      ),
    ])),
}
