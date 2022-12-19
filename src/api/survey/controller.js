import Survey from './models/survey'
import Choice from './models/choice'
import {success} from '../../services/response'

export const create = async ({body}, res, next) => {
  try {
    const surveyId = await Survey.createSurvey(body);
    const msg = {message: `Survey with id: ${surveyId} has been successfully created`}
    success(res, msg)
  } catch (err) {
    next(err)
  }
}

export const index = async ({query}, res, next) => {
  let {limit, after, before, withResult} = query
  try {
    const surveys = await Survey.getAll(withResult, limit, after, before)
    success(res, surveys)
  } catch (err) {
    next(err)
  }
}

export const show = async ({params, query}, res, next) => {
  const {id} = params
  const {withResult} = query
  try {
    const survey = await Survey.getById(id, withResult)
    success(res, survey)
  } catch (err) {
    next(err)
  }
}

export const destroy = async ({params}, res, next) => {
  const {surveyId} = params
  try {
    await Survey.deleteSurvey(surveyId)
    const msg = {message: `Survey has been successfully deleted`}
    success(res, msg)
  } catch(err) {
    next(err)
  }
}

export const answer = async ({params, body}, res, next) => {
  const {surveyId} = params
  const {selectedLocalId} = body
  try {
    await Choice.incrementChoice(surveyId, selectedLocalId)
    const msg = {message: `Your choice with local Id: ${selectedLocalId} to survey with Id: ${surveyId} has been added.`}
    success(res, msg)
  } catch (err) {
    next(err)
  }

}
