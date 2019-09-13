module.exports = (sequelize, DataTypes) => {
  const ScrapeLog = sequelize.define('ScrapeLog', {
    scrapeUrl: DataTypes.STRING(1024),
    scraperName: DataTypes.STRING,
    result: DataTypes.TEXT,
    error: DataTypes.TEXT,
  }, {})
  return ScrapeLog
}
