module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('twitter_accounts', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    screen_name: {
      type: Sequelize.STRING(128),
    },
    preferred_display_name: {
      type: Sequelize.STRING(512),
    },
    list_name: {
      type: Sequelize.STRING(128),
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: queryInterface => queryInterface.dropTable('twitter_accounts'),
}
