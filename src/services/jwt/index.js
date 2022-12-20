import jwt from 'jsonwebtoken'
import {unauthorized} from "../response";
import {masterKey} from '../../config'

export const verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token']
  if (!token)
    return unauthorized(res, {message: 'No token provided.'})

  jwt.verify(token, masterKey, (err, decoded) => {
    if (err)
      return unauthorized(res, {message: 'Unauthorized access'})
    req.userId = decoded.id
    next()
  })
}
