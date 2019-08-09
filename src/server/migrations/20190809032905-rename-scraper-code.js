module.exports = {
  up: queryInterface => queryInterface.renameColumn('claims', 'scraper_code', 'scraper_name'),
  down: queryInterface => queryInterface.renameColumn('claims', 'scraper_name', 'scraper_code'),
}
