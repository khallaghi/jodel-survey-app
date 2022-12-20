import winston from 'winston'
import {logLevel} from '../../config'

const winstonOptions = {
  level: logLevel,
  format: winston.format.simple(),
  transports: [
    new winston.transports.File({filename: 'error.log', level: 'error'}),
    new winston.transports.File({filename: 'combined.log'}),
    new winston.transports.Console()
  ]
}
export default new winston.createLogger(winstonOptions)
