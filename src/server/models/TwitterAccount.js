const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const TwitterAccount = sequelize.define('TwitterAccount', {
    screenName: DataTypes.STRING(128),
    preferredDisplayName: DataTypes.STRING(512),
    listName: DataTypes.STRING(128),
  }, {})

  TwitterAccount.getByListNames = async listNames => (
    TwitterAccount.findAll({
      where: {
        listName: {
          [Sequelize.Op.in]: listNames,
        },
      },
    })
  )

  TwitterAccount.getByListName = async listName => TwitterAccount.getByListNames([listName])

  return TwitterAccount
}
