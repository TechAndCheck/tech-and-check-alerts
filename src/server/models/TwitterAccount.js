const Sequelize = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  const TwitterAccount = sequelize.define('TwitterAccount', {
    screenName: {
      type: DataTypes.STRING(128),
      unique: 'twitterAccountScreenNameListName',
    },
    preferredDisplayName: DataTypes.STRING(512),
    isActive: DataTypes.BOOLEAN,
  }, {})

  TwitterAccount.associate = (models) => {
    TwitterAccount.belongsTo(models.TwitterAccountList)
  }

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

  TwitterAccount.getActiveByListIds = async listIds => TwitterAccount.findAll({
    where: {
      isActive: true,
      TwitterAccountListId: {
        [Sequelize.Op.in]: listIds,
      },
    },
  })

  TwitterAccount.getActiveByListId = async listId => TwitterAccount
    .getActiveByListIds([listId])

  TwitterAccount.deactivateByTwitterAccountList = async (
    twitterAccountList,
    transaction,
  ) => TwitterAccount
    .update(
      { isActive: false },
      {
        where: {
          twitter_account_list_id: twitterAccountList.id, // TODO: Issue #367
        },
        transaction,
      },
    )

  TwitterAccount.createOrActivate = async (twitterAccounts, transaction) => Promise
    .all(
      twitterAccounts.map(
        account => TwitterAccount.upsert(
          account,
          { transaction },
        ),
      ),
    )

  return TwitterAccount
}
