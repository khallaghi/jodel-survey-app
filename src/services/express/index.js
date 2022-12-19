import express from 'express'
import cors from 'cors'
import compression from 'compression'
import morgan from 'morgan'
import bodyParser from 'body-parser'
import {errorHandler as queryErrorHandler} from 'querymen'
import {errorHandler as bodyErrorHandler} from 'bodymen'
import {env} from '../../config'
import {ValidationError} from 'express-json-validator-middleware'
import {badRequest, internalError, notFound} from "../response";
import NotFoundError from "../utils/error";
import bodyParserErrorHandler from 'express-body-parser-error-handler'

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
  app.use(bodyParserErrorHandler())
  app.use((err, req, res, next) => {
    if (err instanceof ValidationError) {
      let messages = []
      err.validationErrors.body.forEach((err) => {
        messages.push(err.message)
      })
      badRequest(res, {message: messages})
      next()
    } else {
      next(err)
    }
  })

  app.use((err, req, res, next) => {
    if (err instanceof NotFoundError) {
      notFound(res, {message: [err.toString()]})
      next()
    } else {
      next(err)
    }
  })

  app.use((err, req, res, next) => {
    if (err)
      internalError(res, {message: [err.toString()]})
    next()
  })

  return app
}
