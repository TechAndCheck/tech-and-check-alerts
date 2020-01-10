import { doesRecordExist } from '../utils/db'

module.exports = (sequelize, DataTypes) => {
  const KnownSpeaker = sequelize.define('KnownSpeaker', {
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
  }, {})

  KnownSpeaker.isKnownSpeaker = async (firstName, lastName) => (
    KnownSpeaker.findOne({
      where: {
        firstName,
        lastName,
      },
    }).then(doesRecordExist)
  )
  return KnownSpeaker
}
