module.exports = (sequelize, DataTypes) => {
  const TwitterAccountList = sequelize.define('TwitterAccountList', {
    name: DataTypes.STRING,
    googleDocId: DataTypes.STRING
  }, {})

  TwitterAccountList.associate = (models) => {
  }

  return TwitterAccountList
}
