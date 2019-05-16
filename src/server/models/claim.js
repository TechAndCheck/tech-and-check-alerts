module.exports = (sequelize, DataTypes) => {
  const Claim = sequelize.define('Claim', {
    content: DataTypes.TEXT,
    claimedAt: DataTypes.DATE,
    sourceUrl: DataTypes.STRING(1024),
    claimBusterScore: DataTypes.FLOAT,
  }, {})
  Claim.associate = (models) => {
    Claim.belongsTo(models.Speaker, {
      as: 'speaker',
    })
  }
  return Claim
}
