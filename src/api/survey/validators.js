import {Validator} from "express-json-validator-middleware"
import {query, body, param} from 'express-validator'

export const createSurveyValidator = () => {
  const {validate} = new Validator();

  const surveySchema = {
    type: 'object',
    required: ['question', 'choices'],
    properties: {
      question: {
        type: 'string'
      },
      choices: {
        type: 'array',
        items: {
          type: 'object',
          required: ['text'],
          properties: {
            text: {
              type: 'string'
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
