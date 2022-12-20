import {Validator} from "express-json-validator-middleware"
import {body, param, query} from 'express-validator'

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
    param('surveyId', 'Invalid survey Id').exists().isUUID()
  ]
}

export const deleteSurveyValidator = () => {
  return param('surveyId', 'Invalid survey Id format').exists().isUUID()
}


