import {Router} from 'express'
import {answer, create, destroy, index, show} from './controller'
import {
  createSurveyValidator,
  deleteSurveyValidator,
  indexSurveysValidator,
  selectAnswerValidator,
  withResultValidator
} from "./validators";
import {checkErrors} from "../../services/middleware"
import {verifyToken} from "../../services/jwt"

const router = new Router()

/**
 * @api {post} /v1/survey Create a new survey
 * @apiName CreateSurvey
 * @apiGroup Survey
 * @apiHeader {string} x-access-token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *      "x-access-token": "eyJhbGciOiJsImlhdCI6MTY3MTU3MjIzNiwiZXhwIjoxNjcxNjU4NjM2fQ.g3qmOFpJpUGMfyW-g_Fuve0MxXBTZRZvgIuQNc_xxJk"
 *    }
 * @apiParamExample {json} Payload structure
 * {
 * 	"question": "How are you today?",
 * 	"choices": [
 * 		{"text": "Very good."},
 * 		{"text": "Not bad."},
 * 		{"text": "Very very bad."}
 * 	]
 * }
 * @apiSuccess (200) {string} message message
 * @apiSuccess (200) {string} surveyId Id of the created survey
 * @apiSuccessExample (200) Success Response:
 * HTTP/1.1 200 OK
 * {
 * 	"message": "Survey with id: 85e68db7-68d0-474f-90ce-bcc10400d195 has been successfully created",
 * 	"surveyId": "85e68db7-68d0-474f-90ce-bcc10400d195"
 * }
 * @apiError (400) {string[]} message List of errors
 * @apiErrorExample Error Response
 * {
 * 	"message": [
 * 		"must have required property 'question'"
 * 	]
 * }
 */

router.post('/', verifyToken, createSurveyValidator() , checkErrors, create)

/**
 * @api {get} /survey?withResult=true&limit=3&after=cursor&before=cursor Retrieve surveys of user
 * @apiName RetrieveSurveys
 * @apiGroup Survey
 * @apiHeader {string} x-access-token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *      "x-access-token": "eyJhbGciOiJsImlhdCI6MTY3MTU3MjIzNiwiZXhwIjoxNjcxNjU4NjM2fQ.g3qmOFpJpUGMfyW-g_Fuve0MxXBTZRZvgIuQNc_xxJk"
 *    }
 * @apiParam {string} withResult Select that show the results or not (`true`|`false`)
 * @apiParam {Number} limit The list size of surveys
 * @apiParam {string} after Show `limit` amount of surveys after a specific cursor
 * @apiParam {string} before Show `limit` amount of surveys before a specific cursor
 * @apiSuccessExample (200) Success Response
 * {
 * 	"totalCount": 7,
 * 	"edges": [
 * 		{
 * 			"node": {
 * 				"id": "ae1f09f7-784c-4f8b-88cc-81b8a9540e4f",
 * 				"question": "How are you today?",
 * 				"createdAt": "2022-12-20T22:21:46.294Z",
 * 				"choices": [
 * 					{
 * 						"localId": 0,
 * 						"text": "Very good.",
 * 						"selectedCount": 0
 * 					},
 * 					{
 * 						"localId": 1,
 * 						"text": "Not bad.",
 * 						"selectedCount": 0
 * 					},
 * 					{
 * 						"localId": 2,
 * 						"text": "Very very bad.",
 * 						"selectedCount": 0
 * 					}
 * 				],
 * 				"user": {
 * 					"username": "mohammad5"
 * 				}
 * 			},
 * 			"cursor": "WyIyMDIyLTEyLTIwVDIyOjIxOjQ2LjI5NFoiLCJhZTFmMDlmNy03ODRjLTRmOGItODhjYy04MWI4YTk1NDBlNGYiXQ=="
 * 		}
 * 	],
 * 	"pageInfo": {
 * 		"hasNextPage": true,
 * 		"hasPreviousPage": true,
 * 		"startCursor": "WyIyMDIyLTEyLTIwVDIyOjIxOjQ2LjI5NFoiLCJhZTFmMDlmNy03ODRjLTRmOGItODhjYy04MWI4YTk1NDBlNGYiXQ==",
 * 		"endCursor": "WyIyMDIyLTEyLTIwVDIyOjIxOjQ2LjI5NFoiLCJhZTFmMDlmNy03ODRjLTRmOGItODhjYy04MWI4YTk1NDBlNGYiXQ=="
 * 	}
 * }
 * @apiError (404 Not Found) {string[]} message List of errors
 * @apiErrorExample (404 Not Found) Error Response
 * {
 * 	"message": [
 * 		"Error: Survey not found"
 * 	]
 * }
 * @apiError (400 Bad Request) {string[]} list of errors if misuse the query strings
 * @apiErrorExample (400 Bad Request) Error Response
 * {
 * 	"message": [
 * 		"Invalid limit size"
 * 	],
 */
router.get('/',
  verifyToken,
  indexSurveysValidator(),
  checkErrors,
  index)

/**
 * @api {get} /survey/:id?withResult=true Retrieve a specific survey
 * @apiName RetrieveSurvey
 * @apiGroup Survey
 * @apiParam {string} id Survey id in UUID format
 * @apiParam {string} withResult Select that show the results or not (`true`|`false`)
 * @apiSuccessExample (200) withResult=true:
 * HTTP/1.1 200 OK
 * {
 * 	"id": "c9c444e1-f163-45aa-890f-4c47f4961df4",
 * 	"question": "How are you today?",
 * 	"createdAt": "2022-12-20T22:04:50.897Z",
 * 	"choices": [
 * 		{
 * 			"localId": 0,
 * 			"text": "Very good.",
 * 		  "selectedCount": 0
 * 		},
 * 		{
 * 			"localId": 1,
 * 			"text": "Not bad.",
 * 		  "selectedCount": 2
 * 		},
 * 		{
 * 			"localId": 2,
 * 			"text": "Very very bad.",
 * 		  "selectedCount": 6
 * 		}
 * 	],
 * 	"user": {
 * 		"username": "mohammad"
 * 	}
 * }
 * @apiSuccessExample (200) withResult=false:
 * HTTP/1.1 200 OK
 * {
 * 	"id": "c9c444e1-f163-45aa-890f-4c47f4961df4",
 * 	"question": "How are you today?",
 * 	"createdAt": "2022-12-20T22:04:50.897Z",
 * 	"choices": [
 * 		{
 * 			"localId": 0,
 * 			"text": "Very good."
 * 		},
 * 		{
 * 			"localId": 1,
 * 			"text": "Not bad."
 * 		},
 * 		{
 * 			"localId": 2,
 * 			"text": "Very very bad."
 * 		}
 * 	],
 * 	"user": {
 * 		"username": "mohammad"
 * 	}
 * }
 * @apiError (404 Not Found) {string[]} message List of errors
 * @apiErrorExample Error Response
 * {
 * 	"message": [
 * 		"Error: Survey not found"
 * 	]
 * }
 */
router.get('/:id',
  withResultValidator(),
  checkErrors,
  show)


/**
 * @api {delete} /survey/:id Delete a specific survey
 * @apiName DeleteSurvey
 * @apiGroup Survey
 * @apiParam {string} id Survey id in UUID format
 * @apiHeader {string} x-access-token
 * @apiHeaderExample {json} Header-Example:
 *     {
 *      "x-access-token": "eyJhbGciOiJsImlhdCI6MTY3MTU3MjIzNiwiZXhwIjoxNjcxNjU4NjM2fQ.g3qmOFpJpUGMfyW-g_Fuve0MxXBTZRZvgIuQNc_xxJk"
 *    }
 * @apiSuccess (200) {string} message message
 * @apiSuccessExample (200) Success Response:
 * HTTP/1.1 200 OK
 * {
 * 	"message": "Survey with Id: 1d33ddcb-026a-4198-93b1-4fabce83ba21 has been successfully deleted"
 * }
 * @apiError (404) {string[]} message List of errors
 * @apiErrorExample Error Response
 * {
 * 	"message": [
 * 		"Error: Survey not found"
 * 	]
 * }
 */
router.delete('/:surveyId',
  verifyToken,
  deleteSurveyValidator(),
  checkErrors,
  destroy)


/**
 * @api {post} /survey/:id/answer Answer to a specific survey
 * @apiName AnswerSurvey
 * @apiGroup Survey
 * @apiParam {string} id survey id in UUID format
 * @apiParamExample {json} Payload structure
 * {
 * 	"selectedLocalId": 1
 * }
 * @apiSuccess (200) {string} message message
 * @apiSuccessExample (200) Success Response:
 * HTTP/1.1 200 OK
 * {
 * 	"message": "Your choice with local Id: 1 to survey with Id: 667be815-0327-45ce-8da5-2454a8905d2b has been added."
 * }
 * @apiError (404) {string[]} message List of errors
 * @apiErrorExample Error Response
 * {
 * 	"message": [
 * 		"Error: Survey not found"
 * 	]
 * }
 */
router.post('/:surveyId/answer',
  selectAnswerValidator(),
  checkErrors,
  answer)
export default router
