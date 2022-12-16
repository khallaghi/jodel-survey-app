import {env, port, ip, apiRoot} from './config'
import express from './services/express'
import api from './api'
import orm from './services/sequelize'

const app = express(apiRoot, api)

setImmediate(() => {
  app.listen(port, ip, () => {
    console.log('Express server listening on http://%s:%d, in %s mode', ip, port, env)
  })
})

orm.authenticate()
  .then(() => {
  console.log("Connecting to database successfully")
  })
  .catch((err) => {
    console.error("Failed to connect to database", err)
  })

orm.sync({force: true})
  .then(() => {
    console.log("Synced db")
  })
  .catch((err) => {
    console.error("Failed to sync db", err)
  })

export default app