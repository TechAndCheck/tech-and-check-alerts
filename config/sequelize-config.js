const dotenv = require('dotenv')
dotenv.config();

module.exports = {
  "development": {
    "url": process.env.DATABASE_URL_DEV || "",
    "dialect": "postgres"
  },
  "test": {
    "url": process.env.DATABASE_URL_TEST || "",
    "dialect": "postgres"
  },
  "production": {
    "url": process.env.DATABASE_URL_PROD || "",
    "dialect": "postgres"
  }
}
