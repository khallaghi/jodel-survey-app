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
    logLevel: process.env.LOG_LEVEL || 'http'
  },
  test: {
    db: {
      dialect: 'sqlite',
      storage: path.join(__dirname, '../storage/database-test.sqlite')
    }
  },
  development: {
    db: {
      dialect: 'sqlite',
      storage: path.join(__dirname, '../storage/database.sqlite')
    }
  },
  production: {
    ip: process.env.IP || undefined,
    port: process.env.PORT || 8080,
    apiRoot: process.env.API_ROOT || '/v1',
    db: {
      dialect: process.env.DB_DIALECT || 'sqlite',
      storage: process.env.DB_STORAGE || '/storage/database.sqlite'
    }
  }
}

module.exports = merge(config.all, config[config.all.env])
export default module.exports
