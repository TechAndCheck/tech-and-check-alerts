module.exports = (sequelize, DataTypes) => {
  const Speaker = sequelize.define('Speaker', {
    fullName: DataTypes.STRING,
    affiliation: DataTypes.STRING,
  }, {})
  Speaker.associate = (models) => {
    Speaker.hasMany(models.Claim, {
      as: 'claims',
    })
  }
  return Speaker
}
