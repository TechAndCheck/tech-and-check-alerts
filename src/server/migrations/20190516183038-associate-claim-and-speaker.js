module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
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
  ),

  down: queryInterface => queryInterface.removeColumn(
    'claims',
    'speaker_id',
  ),
}
