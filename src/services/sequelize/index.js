import {Sequelize} from 'sequelize'
import {db} from '../../config'
import logger from '../winston'


const opts = {
  logging: (msg) => logger.info(msg),
};

Object.assign(opts, db)
export const orm = new Sequelize(opts)
orm.authenticate()
  .then(() => logger.info('Connection has been established successfully.'))
  .catch((err) => logger.error('Unable to connect to the database: ', err))

export const setupDb = async () => {
  await orm.sync({force: true})
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
