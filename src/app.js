import {apiRoot, env, ip, port} from './config'
import express from './services/express'
import api from './api'
import {orm, setupDb} from './services/sequelize'

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

await setupDb()
export default app
