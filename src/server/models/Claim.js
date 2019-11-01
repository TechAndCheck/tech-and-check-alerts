module.exports = (sequelize, DataTypes) => {
  const Claim = sequelize.define('Claim', {
    content: DataTypes.TEXT,
    claimedAt: DataTypes.DATE,
    canonicalUrl: DataTypes.STRING(1024),
    scraperName: DataTypes.STRING, // The scraper that generated this claim
    source: DataTypes.STRING(1024),
    speakerName: DataTypes.STRING(1024),
    speakerAffiliation: DataTypes.STRING(1024),
    claimBusterScore: DataTypes.FLOAT,
  }, {})
  return Claim
}
