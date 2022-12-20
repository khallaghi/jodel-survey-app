/* eslint-disable no-unused-vars */
import path from 'path'
import merge from 'lodash/merge'

/* istanbul ignore next */
const requireProcessEnv = (name) => {
  if (!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable')
  }
  return process.env[name]
}

/* istanbul ignore next */
if (process.env.NODE_ENV !== 'production') {
  const dotenv = require('dotenv-safe')
  dotenv.config({
    path: path.join(__dirname, '../.env'),
    example: path.join(__dirname, '../.env.example')
  })
}

const config = {
  all: {
    env: process.env.NODE_ENV || 'development',
    root: path.join(__dirname, '..'),
    port: process.env.PORT || 9000,
    ip: process.env.IP || '0.0.0.0',
    apiRoot: process.env.API_ROOT || '/v1',
    masterKey: requireProcessEnv('MASTER_KEY'),
    jwtExpiryTime: 86400,
    logLevel: process.env.LOG_LEVEL || 'http',
    databaseUser: process.env.DB_USER || undefined,
    databasePass: process.env.DB_PASS || undefined,
    databaseName: process.env.DB_NAME || undefined,
    resetDb: process.env.RESET_DB || true
  },
  test: {
    db: {
      dialect: process.env.DB_DIALECT ||'sqlite',
      storage: process.env.DB_STORAGE || path.join(__dirname, '../storage/database-test.sqlite'),
      host: process.env.DB_HOST || undefined
    }
  },
  development: {
    db: {
      dialect: process.env.DB_DIALECT ||'sqlite',
      storage: process.env.DB_STORAGE || path.join(__dirname, '../storage/database.sqlite'),
      host: process.env.DB_HOST || undefined
    }
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || 8080,
    apiRoot: process.env.API_ROOT || '/v1',
    resetDb: process.env.RESET_DB || false,
    db: {
      dialect: process.env.DB_DIALECT || undefined,
      storage: process.env.DB_STORAGE || undefined,
      host: process.env.DB_HOST || undefined
    }
  }
}

module.exports = merge(config.all, config[config.all.env])
export default module.exports
