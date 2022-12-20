import {body} from 'express-validator'


export const credentialValidator = () => {
  return [
    body('username', 'Invalid username format').exists().isAlphanumeric(),
    body('password', 'Invalid password format').exists().isAlphanumeric()
  ]
}
