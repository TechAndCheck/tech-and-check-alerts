module.exports = (sequelize, DataTypes) => {
  const TwitterAccountList = sequelize.define('TwitterAccountList', {
    name: DataTypes.STRING,
    googleDocId: DataTypes.STRING,
  }, {})

  TwitterAccountList.associate = (models) => {
    TwitterAccountList.hasMany(models.TwitterAccount)
  }

  return TwitterAccountList
}
