module.exports = (sequelize, DataTypes) => {
  const Claim = sequelize.define('Claim', {
    content: DataTypes.TEXT,
    claimedAt: DataTypes.DATE,
    canonicalUrl: DataTypes.STRING(1024),
    scraperCode: DataTypes.STRING(1024), // The scraper that generated this claim
    source: DataTypes.STRING(1024),
    claimBusterScore: DataTypes.FLOAT,
  }, {})
  Claim.associate = (models) => {
    Claim.belongsTo(models.Speaker, {
      as: 'speaker',
    })
  }
  return Claim
}
