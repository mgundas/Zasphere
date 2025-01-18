const config = require('config')
require('dotenv').config()

module.exports = {
  port: process.env.PORT || config.get('port'),
  db: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    clusterUrl: process.env.DB_CLUSTER_URL,
    name: process.env.DB_NAME
  },
  apiBaseUrl: process.env.API_BASE_URL || config.get('apiBaseUrl'),
  nodeEnv: process.env.NODE_ENV || config.get('nodeEnv')
}