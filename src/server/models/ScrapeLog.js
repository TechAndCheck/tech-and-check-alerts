module.exports = (sequelize, DataTypes) => {
  const ScrapeLog = sequelize.define('ScrapeLog', {
    scrapeUrl: DataTypes.STRING(1024),
    scraperName: DataTypes.STRING,
    scrapeResponseCode: DataTypes.STRING,
    scrapeResponseMessage: DataTypes.TEXT,
  }, {})
  return ScrapeLog
}
