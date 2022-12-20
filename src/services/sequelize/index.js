import {Sequelize} from 'sequelize'
import {databaseName, databasePass, databaseUser, db, resetDb} from '../../config'
import logger from '../winston'


const opts = {
  logging: (msg) => logger.info(msg),
};

Object.assign(opts, db)
export const orm = new Sequelize(databaseName, databaseUser, databasePass, opts)
orm.authenticate()
  .then(() => logger.info('Connection has been established successfully.'))
  .catch((err) => logger.error('Unable to connect to the database: ', err))

export const setupDb = async () => {
  let options = {force: false}
  if (resetDb){
    logger.warn('Resetting Database ... ')
    options.force = true
  }
  await orm.sync(options)
    .then(() => {
      logger.info("Database has been synced successfully.")
    })
    .catch((err) => {
      logger.error("Failed to sync database.", err)
    })
}

export const closeDb = async () => {
  await orm.close()
}
