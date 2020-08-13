module.exports = (sequelize, DataTypes) => {
  const Newsletter = sequelize.define('Newsletter', {
    label: DataTypes.STRING,
    mailingListAddress: DataTypes.STRING,
    templateName: DataTypes.STRING,
    textTemplateName: DataTypes.STRING,
    templateSettings: DataTypes.JSON,
    subjectDecoration: DataTypes.STRING,
    enabledMedia: DataTypes.JSON,
    claimLimit: DataTypes.INTEGER,
  }, {})

  Newsletter.associate = (models) => {
    Newsletter.belongsTo(models.TwitterAccountList)
  }

  Newsletter.findByLabel = label => Newsletter.findOne({
    where: {
      label,
    },
  })

  return Newsletter
}
