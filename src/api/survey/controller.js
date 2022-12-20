import Survey from './models/survey'
import Choice from './models/choice'
import User from '../user/model'
import {success} from '../../services/response'

export const create = async ({body, userId}, res, next) => {
  try {
    const user = await User.getUserById(userId)
    const surveyId = await Survey.createSurvey(body, user);
    const msg = {
      message: `Survey with id: ${surveyId} has been successfully created`,
      surveyId
    }
    success(res, msg)
  } catch (err) {
    next(err)
  }
}

export const index = async ({query, userId}, res, next) => {
  let {limit, after, before, withResult} = query
  try {
    const surveys = await Survey.getAll(userId, withResult, limit, after, before)
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

export const destroy = async ({params, userId}, res, next) => {
  const {surveyId} = params
  try {
    await Survey.deleteSurvey(surveyId, userId)
    const msg = {message: `Survey with Id: ${surveyId} has been successfully deleted`}
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
