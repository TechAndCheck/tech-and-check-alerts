const assert = require('assert')
const dotenv = require('dotenv')

dotenv.config()

// I'm not sure if this should be in an external utility, but given how odd sequelize config
// is I would like to have this check be directly next to the area where configuration
// is defined, in case it ever changes.
//
// It is CRITICAL that the test database never match produciton / dev, since tests can be
// destructive to data.
//
// I'm wrapping this check in a method name anyway just for the sake of readability.
const assertSafeDatabaseConfiguration = function() {
  const testDatabaseURL = new URL(process.env.DATABASE_URL_TEST)
  const devDatabaseURL = new URL(process.env.DATABASE_URL_DEVELOPMENT)
  const prodDatabaseURL = new URL(process.env.DATABASE_URL_PRODUCTION)
  assert(
    testDatabaseURL.pathname !== devDatabaseURL.pathname,
    `Test DB (${testDatabaseURL.pathname}) cannot match Development DB (${devDatabaseURL.pathname})`,
  )
  assert(
    testDatabaseURL.pathname !== prodDatabaseURL.pathname,
    `Test DB (${testDatabaseURL.pathname}) cannot match Production DB (${devDatabaseURL.pathname})`,
  )
}

assertSafeDatabaseConfiguration()

module.exports = {
  development: {
    url: process.env.DATABASE_URL_DEVELOPMENT || '',
    dialect: 'postgres',
    define: {
      underscored: true,
    },
  },
  test: {
    url: process.env.DATABASE_URL_TEST || '',
    dialect: 'postgres',
    define: {
      underscored: true,
    },
  },
  production: {
    url: process.env.DATABASE_URL_PRODUCTION || '',
    dialect: 'postgres',
    define: {
      underscored: true,
    },
  },
}
