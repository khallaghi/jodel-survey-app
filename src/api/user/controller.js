import {notFound, success} from '../../services/response/'
import User from './model'
import jwt from 'jsonwebtoken'
import {jwtExpiryTime, masterKey} from '../../config'

export const create = async ({body}, res, next) => {
  const {username, password} = body
  try {
    const user = await User.createUser(username, password)
    const message = `User ${username} has been successfully created.`
    success(res, {message, userId: user.id})
  } catch (err) {
    next(err)
  }
}


export const login = async (req, res, next) => {
  const {username, password} = req.body
  try {
    const user = await User.getUser(username, password)
    if (!user)
      return notFound(res, {message: 'User not found'})
    const token = jwt.sign({id: user.id}, masterKey, {expiresIn: jwtExpiryTime})
    const result = {
      id: user.id,
      username: user.username,
      accessToken: token
    }
    success(res, result)
  } catch (err) {
    next(err)
  }
}
