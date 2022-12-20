import {apiRoot, env, ip, port} from './config'
import express from './services/express'
import api from './api'
import {setupDb} from './services/sequelize'
import logger from './services/winston'

logger.info('API ROOT')
logger.info(apiRoot)
const app = express(apiRoot, api)

setImmediate(() => {
  app.listen(port, ip, () => {
    logger.info(`Express server listening on http://${ip}:${port}, in ${env} mode`)
  })
})

setImmediate(async () => {
  logger.info('Setup connection to database')
  await setupDb()
})
export default app
