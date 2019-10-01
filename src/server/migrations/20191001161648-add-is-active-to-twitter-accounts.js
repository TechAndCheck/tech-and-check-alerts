module.exports = {
  up: (queryInterface, Sequelize) => queryInterface
    .addColumn(
      'twitter_accounts',
      'is_active',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false,
      },
    ),

  down: queryInterface => queryInterface
    .removeColumn(
      'twitter_accounts',
      'is_active',
    ),
}
