import {Router} from 'express'
import {answer, create, destroy, index, show, update} from './controller'

const router = new Router()

/**
 * @api {post} /survey Create survey
 * @apiName CreateSurvey
 * @apiGroup Survey
 * @apiSuccess {Object} survey Survey's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Survey not found.
 */
router.post('/',
  create)

/**
 * @api {get} /survey Retrieve surveys
 * @apiName RetrieveSurveys
 * @apiGroup Survey
 * @apiUse listParams
 * @apiSuccess {Object[]} surveys List of surveys.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  index)

/**
 * @api {get} /survey/:id Retrieve survey
 * @apiName RetrieveSurvey
 * @apiGroup Survey
 * @apiSuccess {Object} survey Survey's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Survey not found.
 */
router.get('/:id',
  show)

/**
 * @api {put} /survey/:id Update survey
 * @apiName UpdateSurvey
 * @apiGroup Survey
 * @apiSuccess {Object} survey Survey's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Survey not found.
 */
router.put('/:id',
  update)

/**
 * @api {delete} /survey/:id Delete survey
 * @apiName DeleteSurvey
 * @apiGroup Survey
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Survey not found.
 */
router.delete('/:id',
  destroy)


/**
 * @api {post} /survey/:id/answer answer to a survey
 * @apiName AnswerSurvey
 * @apiGroup Survey
 * @apiSuccess (Success 200 ) 200 No Content.
 * @apiError 404 Survey not found
 */
router.post('/:surveyId/answer',
  answer)
export default router
