const dotenv = require('dotenv')
dotenv.config();

module.exports = {
  "development": {
    "url": process.env.DATABASE_URL_DEVELOPMENT || "",
    "dialect": "postgres"
  },
  "test": {
    "url": process.env.DATABASE_URL_TEST || "",
    "dialect": "postgres"
  },
  "production": {
    "url": process.env.DATABASE_URL_PRODUCTION || "",
    "dialect": "postgres"
  }
}
