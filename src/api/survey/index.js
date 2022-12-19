import {Router} from 'express'
import {answer, create, destroy, index, show} from './controller'
import {
  createSurveyValidator,
  deleteSurveyValidator,
  indexSurveysValidator,
  selectAnswerValidator,
  withResultValidator
} from "./validators";

const router = new Router()

/**
 * @api {post} /survey Create survey
 * @apiName CreateSurvey
 * @apiGroup Survey
 * @apiSuccess {Object} survey Survey's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Survey not found.
 */

router.post('/',createSurveyValidator() , create)

/**
 * @api {get} /survey Retrieve surveys
 * @apiName RetrieveSurveys
 * @apiGroup Survey
 * @apiUse listParams
 * @apiSuccess {Object[]} surveys List of surveys.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
  indexSurveysValidator(),
  index)

/**
 * @api {get} /survey/:id Retrieve survey
 * @apiName RetrieveSurvey
 * @apiGroup Survey
 * @apiSuccess {Object} survey Survey's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Survey not found.
 */
router.get('/:id', withResultValidator(),
  show)


/**
 * @api {delete} /survey/:id Delete survey
 * @apiName DeleteSurvey
 * @apiGroup Survey
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Survey not found.
 */
router.delete('/:surveyId',
  deleteSurveyValidator(),
  destroy)


/**
 * @api {post} /survey/:id/answer answer to a survey
 * @apiName AnswerSurvey
 * @apiGroup Survey
 * @apiSuccess (Success 200 ) 200 No Content.
 * @apiError 404 Survey not found
 */
router.post('/:surveyId/answer',
  selectAnswerValidator(),
  answer)
export default router
