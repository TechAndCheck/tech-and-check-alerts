import Sequelize from 'sequelize'

import {
  isJsonFile,
  getFileContents,
} from '../server/utils'
import logger from '../server/utils/logger'

import models from '../server/models'

const { TwitterAccount } = models

const getListName = () => {
  const listNameFlag = process.argv.indexOf('-l')
  if (listNameFlag !== -1) {
    const listName = process.argv[listNameFlag + 1]
    return listName
  }
  return null
}

const getFileName = () => {
  const fileName = process.argv[process.argv.length - 1]
  return isJsonFile(fileName) ? fileName : null
}

const getTwitterAccountsFromFile = (fileName) => {
  try {
    const fileContents = getFileContents(`${__dirname}/${fileName}`)
    const twitterAccounts = JSON.parse(fileContents)
    return twitterAccounts.reduce((accounts, account) => {
      // eslint-disable-next-line no-param-reassign
      accounts[account.screenName] = account
      return accounts
    }, {})
  } catch (e) {
    logger.error(e.message)
    process.exit()
  }
  return {}
}

const deactivateAbsentAccounts = (listName, presentAccounts) => TwitterAccount
  .update({ isActive: false }, {
    where: {
      listName,
      [Sequelize.Op.not]: {
        screenName: {
          [Sequelize.Op.iLike]: {
            [Sequelize.Op.any]: Object.keys(presentAccounts), // TODO: Replace with smart pluck()
          },
        },
      },
    },
  })

const updatePresentAccounts = (listName, presentAccounts) => TwitterAccount
  .findAll({
    where: {
      listName,
      isActive: true,
      screenName: {
        [Sequelize.Op.iLike]: {
          [Sequelize.Op.any]: Object.keys(presentAccounts), // TODO: Replace with smart pluck()
        },
      },
    },
  }).then(accounts => accounts.forEach(account => account.set({
    // PICK UP: This won't work because of case sensitivity; need to replace this findAll with expensive looped query?
    preferredDisplayName: presentAccounts[account.screenName].preferredDisplayName,
  })))

// const addNewAccounts = (listName, presentScreenNames)

const listName = getListName()
if (!listName) {
  logger.error('You must provide a list name using the -l flag.')
  process.exit()
}

const accountsFileName = getFileName()
if (!accountsFileName) {
  logger.error('You must provide a path to a JSON file as the final argument.')
  process.exit()
}

const currentAccounts = getTwitterAccountsFromFile(accountsFileName)

Promise.all([
  deactivateAbsentAccounts(listName, currentAccounts),
  updatePresentAccounts(listName, currentAccounts),
]).then(() => {
  logger.info('Done deactivating.')
}).catch((e) => {
  logger.error(e.message)
}).finally(() => process.exit())
