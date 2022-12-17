import Choice from './choice'
import Survey from './survey'
import {closeDb, initDb} from '../../../services/sequelize'

beforeAll(async () => {
  await initDb()
})

afterAll(async () => {
  await Choice.destroy({truncate: true})
  await Survey.destroy({truncate: true})
  await closeDb()
})
it('Test increment a choice', async () => {
  const expectedBody = {
    "question": "hello how are you?",
    "choices": [
      {"text": "very good"},
      {"text": "not bad"},
      {"text": "very very bad"}
    ]
  }
  const survey = await Survey.createSurvey(expectedBody)
  await Choice.incrementChoice(survey.id, survey.choices[0].localId)
  const choice = await Choice.findOne({where: {id: survey.choices[0].id}})
  expect(choice.selectedCount).toEqual(1)
})

it('Test increment choice with wrong id', async () => {
  const expectedBody = {
    "question": "hello how are you?",
    "choices": [
      {"text": "very good"},
      {"text": "not bad"},
      {"text": "very very bad"}
    ]
  }
  const survey = await Survey.createSurvey(expectedBody)
  const randomId = 'randomId'
  await Choice.incrementChoice(randomId, survey.choices[0].localId)
  const choice = await Choice.findOne({where: {id: survey.choices[0].id}})
  expect(choice.selectedCount).toEqual(0)
})
