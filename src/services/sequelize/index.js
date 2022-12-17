import {Sequelize} from 'sequelize'
import {db} from '../../config'

export const orm = new Sequelize(db)
export const initDb = async () => {
  await orm.sync({force: true})
    .then(() => {
      console.log("Synced db")
    })
    .catch((err) => {
      console.error("Failed to sync db", err)
    })
}

export const closeDb = async () => {
  await orm.close()
}
