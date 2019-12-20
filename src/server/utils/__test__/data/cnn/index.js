import fs from 'fs'

import { isJsonFile } from '../../..'

const testSuiteBasePath = `${__dirname}`
const testSuites = {}

const loadTestSuite = suitePath => fs
  .readdirSync(suitePath)
  .filter(isJsonFile)
  .map((fileName) => {
    const filePath = `${suitePath}/${fileName}`
    const rawData = fs.readFileSync(filePath)
    const parsedData = JSON.parse(rawData)
    const { functionName } = parsedData
    testSuites[functionName] = testSuites[functionName] || []
    const newTestItem = {
      filePath,
      data: parsedData,
    }
    testSuites[functionName].push(newTestItem)
    return newTestItem
  })

const loadAllTestSuites = () => fs
  .readdirSync(testSuiteBasePath)
  .map((fileName) => {
    const fullPath = `${testSuiteBasePath}/${fileName}`
    const isDirectory = fs.lstatSync(fullPath).isDirectory()
    if (isDirectory) {
      loadTestSuite(fullPath)
    }
    return null
  })

loadAllTestSuites()

export default testSuites
