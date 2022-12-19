import Survey from './models/survey'
import Choice from './models/choice'
import {internalError, notFound, success} from '../../services/response'

export const create = async ({body}, res, next) => {
  try {
    const survey = await Survey.createSurvey(body);
    success(res, survey)
  } catch (err) {
    internalError(res, err)
    next()
  }
}

export const index = async (req, res, next) => {
  let {limit, after, before, withResult} = req.query
  try {
    const surveys = await Survey.getAll(withResult, limit, after, before)
    success(res, surveys)
  } catch (error) {
    internalError(res, error)
    next()
  }
}

export const show = async (req, res, next) => {
  const {id} = req.params
  const {withResult} = req.query
  try {
    const survey = await Survey.getById(id, withResult)
    if (survey != null)
      success(res, survey)
    else
      notFound(res)
  } catch (err) {
    internalError(res, err)
    next()
  }
}

export const destroy = async (req, res, next) => {
  const {surveyId} = req.params

  try {
    await Survey.deleteSurvey(surveyId)
    success(res)
  } catch (err) {
    console.error(err)
    internalError(res)
  }
}

export const answer = async (req, res) => {
  const {surveyId} = req.params
  const {selectedLocalId} = req.body
  try {
    if (await Choice.incrementChoice(surveyId, selectedLocalId))
      success(res)
    else notFound(res)
  } catch(err) {
    internalError(res, err)
  }
}
