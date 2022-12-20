import Choice from './choice'
import {initDbWithOneData} from "../../../../test/initialization";
import {NotFoundError} from "../../../services/utils/error";


it('Test increment a choice', async () => {
  const {expectedSurvey} = await initDbWithOneData()
  await Choice.incrementChoice(expectedSurvey.id, expectedSurvey.choices[0].localId)
  const choice = await Choice.findOne({where: {id: expectedSurvey.choices[0].id}})
  expect(choice.selectedCount).toEqual(1)
})

it('Test increment choice with wrong id', async () => {

  const {expectedSurvey} = await initDbWithOneData()
  const randomId = 'randomId'
  await expect(Choice.incrementChoice(randomId, expectedSurvey.choices[0].localId))
    .rejects
    .toThrow(NotFoundError)
  const choice = await Choice.findOne({where: {id: expectedSurvey.choices[0].id}})
  expect(choice.selectedCount).toEqual(0)
})
