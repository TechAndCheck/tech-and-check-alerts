const dotenv = require('dotenv')

dotenv.config()

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
