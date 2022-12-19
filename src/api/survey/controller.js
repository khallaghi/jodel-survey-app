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
  limit = limit ? parseInt(limit): undefined
  try {
    const surveys = await Survey.getAll(withResult, limit, after, before)
    success(res, surveys)
  } catch (error) {
    internalError(res, error)
    next()
  }
}

export const show = async ({params, query}, res, next) => {
  const {id} = params
  const {withResult} = query
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

export const update = ({body, params}, res, next) =>
  res.status(200).json(body)

export const destroy = ({params}, res, next) =>
  res.status(204).end()

export const answer = async ({params, body}, res, next) => {
  const {surveyId} = params
  const {selectedLocalId} = body
  try {
    if (await Choice.incrementChoice(surveyId, selectedLocalId))
      success(res)
    else notFound(res)
  } catch(err) {
    internalError(res, err)
  }
}
