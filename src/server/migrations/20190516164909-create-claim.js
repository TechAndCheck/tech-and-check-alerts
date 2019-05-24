module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('claims', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    content: {
      type: Sequelize.TEXT,
    },
    claimed_at: {
      type: Sequelize.DATE,
    },
    source_url: {
      type: Sequelize.STRING(1024),
    },
    claim_buster_score: {
      type: Sequelize.FLOAT,
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
  down: queryInterface => queryInterface.dropTable('claims'),
}
