import {Sequelize} from 'sequelize'
import {db} from '../../config'

export const orm = new Sequelize(db)
export const setupDb = async () => {
  await orm.sync({force: true})
    .then(() => {
      console.log("Database has been synced successfully.")
    })
    .catch((err) => {
      console.error("Failed to sync database.", err)
    })
}

export const closeDb = async () => {
  await orm.close()
}
