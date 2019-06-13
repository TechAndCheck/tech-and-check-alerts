import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'

import config from '../config'
import { ENV_NAMES } from '../constants'
import sequelizeConfig from '../../../config/sequelize-config'

const env = config.NODE_ENV || ENV_NAMES.DEVELOPMENT
const envConfig = sequelizeConfig[env]

const db = {}
const sequelize = new Sequelize(envConfig.url, envConfig)

const getModelFiles = () => {
  const isFileVisible = file => file.indexOf('.') !== 0
  const isFileDifferentFromThisFile = file => file !== path.basename(__filename)
  const isFileJavaScript = file => file.slice(-3) === '.js'

  return fs
    .readdirSync(__dirname)
    .filter(file => (
      isFileVisible(file) && isFileDifferentFromThisFile(file) && isFileJavaScript(file)))
}

// Uses the `db` and `sequelize` variables defined above thanks to lexical scoping
const registerModels = (modelFiles) => {
  modelFiles.forEach((modelFile) => {
    const model = sequelize.import(path.join(__dirname, modelFile))
    db[model.name] = model
  })
}

// Uses the `db` variable defined above thanks to lexical scoping
const registerModelAssociations = () => {
  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db)
    }
  })
}

const modelFiles = getModelFiles()
registerModels(modelFiles)
registerModelAssociations()

db.sequelize = sequelize
db.Sequelize = Sequelize

module.exports = db
