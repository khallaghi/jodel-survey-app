import {Validator} from "express-json-validator-middleware"
import {body, param, query, validationResult} from 'express-validator'
import {badRequest} from "../../services/response";

export const createSurveyValidator = () => {
  const {validate} = new Validator();

  const surveySchema = {
    type: 'object',
    required: ['question', 'choices'],
    properties: {
      question: {
        type: 'string',
        minLength: 3,
        maxLength: 255
      },
      choices: {
        type: 'array',
        items: {
          type: 'object',
          required: ['text'],
          properties: {
            text: {
              type: 'string',
              minLength: 1,
              maxLength: 255
            }
          }
        }
      }
    }
  }

  return validate({body: surveySchema})
}

export const withResultValidator = () => {
  return query('withResult', 'Invalid value for withResult key')
    .optional()
    .isIn(['true', 'false'])
}

export const indexSurveysValidator = () => {
  return [
    withResultValidator(),
    query('limit', 'Invalid limit size').optional().isInt(),
    query(['after', 'before'], 'Invalid cursor').optional(),
  ]
}

export const selectAnswerValidator = () => {
  return [
    body('selectedLocalId', 'Invalid selected local Id').exists().isInt(),
    param('surveyId', 'Invalid survey Id').exists().isInt()
  ]
}

export const deleteSurveyValidator = () => {
  return param('surveyId', 'Invalid survey Id').exists().isInt()
}

export const checkErrors = (req, res, next) => {
  const error = validationResult(req).formatWith(({msg}) => msg);
  const hasError = !error.isEmpty();
  if (hasError) {
    badRequest(res, {error: error.array()});
  } else {
    next();
  }
}
