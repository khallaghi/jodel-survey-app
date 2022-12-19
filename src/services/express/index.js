import express from 'express'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import {errorHandler as queryErrorHandler} from 'querymen'
import {errorHandler as bodyErrorHandler} from 'bodymen'
import {env} from '../../config'
import {ValidationError} from 'express-json-validator-middleware'
import {validationResult} from "express-validator";

export default (apiRoot, routes) => {
  const app = express()

  /* istanbul ignore next */
  if (env === 'production' || env === 'development') {
    app.use(cors())
    app.use(compression())
    app.use(morgan('dev'))
  }

  app.use(bodyParser.urlencoded({extended: false}))
  app.use(bodyParser.json())
  app.use(apiRoot, routes)
  app.use(queryErrorHandler())
  app.use(bodyErrorHandler())

  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
      res.status(400).send(err.validationErrors)
      next()
    } else {
      next(err)
    }
  })

  app.use((err, req, res, next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty())
      res.status(400).json({errors: errors.array()})
    next(err)
  })

  return app
}
