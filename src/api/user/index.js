import {Router} from 'express'
import {create, login} from './controller'
import {credentialValidator} from "./validators";
import {checkErrors} from "../../services/middleware";

const router = new Router()

/**
 * @api {post} /user Create new user
 * @apiName CreateUser
 * @apiGroup User
 * @apiParam {string} username
 * @apiParam {string} password
 * @apiParamExample {json} Payload structure
 * {
 * 	"username": "mohammad",
 * 	"password": "passv0r4"
 * }
 * @apiSuccess (200) {string} message message
 * @apiSuccessExample (200) Success Response:
 * {
 * 	"message": "User mohammad has been successfully created.",
 * 	"userId": "efb0722a-1f45-4e39-9e42-c2641a90c1a3"
 * }

 * @apiError (404) {string[]} message List of errors
 * @apiErrorExample Error Response
 * {
 * 	"message": [
 * 		"Error: User not found"
 * 	]
 * }
 */
router.post('/',
  credentialValidator(),
  checkErrors,
  create)

/**
 * @api {post} /user/login Signin user and get jwt token
 * @apiName Login
 * @apiGroup User
 * @apiParamExample {json} Payload structure
 * {
 * 	"username": "mohammad",
 * 	"password": "passv0r4"
 * }
 * @apiSuccess (200) {string} accessToken JWT access token should use it as `x-access-token` in header of other requests which need it
 * @apiSuccessExample (200) Success Response:
 * HTTP/1.1 200 OK
 * {
 * 	"id": "9186f029-e95c-452e-9afd-da21b1400014",
 * 	"username": "mohammad",
 * 	"accessToken": "eyJhbGciOiJIUzI1NiIsInR5iMTQwMDAxNCIsImlhdCI6McZXhwIjoxNjcxNjU4NjM2fQ.g3qmOFpJpUGMfyW-g_Fuve0MxXBTZRZvgIuQNc_xxJk"
 * }
 * @apiError {Object} 400 invalid password or username
 * * @apiErrorExample Error Response
 * {
 * 	"message": [
 * 		"Error: User not found"
 * 	]
 * }
 */
router.post('/login',
  credentialValidator(),
  checkErrors,
  login)



export default router
