module.exports = (sequelize, DataTypes) => {
  const StatementLog = sequelize.define('StatementLog', {
    canonicalUrl: DataTypes.STRING(1024),
    scraperName: DataTypes.STRING,
  }, {})

  StatementLog.getMostRecentStatementLogByStatement = async statement => (
    StatementLog.findOne({
      attributes: ['createdAt'],
      where: {
        canonicalUrl: statement.canonicalUrl,
        scraperName: statement.scraperName,
      },
      order: [['createdAt', 'DESC']],
    })
  )
  return StatementLog
}
