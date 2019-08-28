module.exports = (sequelize, DataTypes) => {
  const TwitterAccount = sequelize.define('TwitterAccount', {
    screenName: DataTypes.STRING(128),
    preferredDisplayName: DataTypes.STRING(512),
    listName: DataTypes.STRING(128),
  }, {})
  return TwitterAccount
}
