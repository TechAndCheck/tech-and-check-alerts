module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.changeColumn('scrape_logs', 'scrape_url', {
    type: Sequelize.STRING(1024),
  }),
  down: (queryInterface, Sequelize) => queryInterface.changeColumn('scrape_logs', 'scrape_url', {
    type: Sequelize.STRING,
  }),
}
