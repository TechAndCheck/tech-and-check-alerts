module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn(
      'speakers',
      'affiliation',
      Sequelize.STRING,
    ),

  down: queryInterface => queryInterface
    .removeColumn(
      'speakers',
      'affiliation',
    ),
}
