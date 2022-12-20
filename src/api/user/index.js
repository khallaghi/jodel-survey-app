import {Router} from 'express'
import {create, login} from './controller'
import {credentialValidator} from "./validators";
import {checkErrors} from "../../services/middleware";

const router = new Router()

/**
 * @api {post} /user Create user
 * @apiName CreateUser
 * @apiGroup User
 * @apiSuccess {Object} user User's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 User not found.
 */
router.post('/',
  credentialValidator(),
  checkErrors,
  create)

/**
 * @api {post} /user/login sign in user
 * @apiName Login
 * @apiGroup User
 * @apiSuccess {Object} jwt token
 * @apiError {Object} 400 invalid password or username
 */
router.post('/login',
  credentialValidator(),
  checkErrors,
  login)



export default router
