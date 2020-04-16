const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const TwitterAccount = sequelize.define('TwitterAccount', {
    screenName: {
      type: DataTypes.STRING(128),
      unique: 'twitterAccountScreenNameListName',
    },
    preferredDisplayName: DataTypes.STRING(512),
    listName: {
      type: DataTypes.STRING(128),
      unique: 'twitterAccountScreenNameListName',
    },
    isActive: DataTypes.BOOLEAN,
  }, {})

  TwitterAccount.getByScreenNames = async screenNames => (TwitterAccount.findAll({
    where: {
      screenName: {
        [Sequelize.Op.in]: screenNames,
      },
    },
    order: [['createdAt', 'DESC']],
  }))

  TwitterAccount.getByScreenName = async screenName => TwitterAccount.getByScreenNames([screenName])

  TwitterAccount.getActive = async () => TwitterAccount.findAll({
    where: {
      isActive: true,
    },
  })

  TwitterAccount.getActiveByListNames = async listNames => (
    TwitterAccount.findAll({
      where: {
        listName: {
          [Sequelize.Op.in]: listNames,
        },
        isActive: true,
      },
    })
  )

  TwitterAccount.getActiveByListName = async listName => TwitterAccount
    .getActiveByListNames([listName])

  return TwitterAccount
}
