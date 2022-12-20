import Choice from './choice'
import {initDbWithOneData} from "../../../../test/initialization";
import NotFoundError from "../../../services/utils/error";


it('Test increment a choice', async () => {
  const {expectedData} = await initDbWithOneData()
  await Choice.incrementChoice(expectedData.id, expectedData.choices[0].localId)
  const choice = await Choice.findOne({where: {id: expectedData.choices[0].id}})
  expect(choice.selectedCount).toEqual(1)
})

it('Test increment choice with wrong id', async () => {

  const {expectedData} = await initDbWithOneData()
  const randomId = 'randomId'
  await expect(Choice.incrementChoice(randomId, expectedData.choices[0].localId))
    .rejects
    .toThrow(NotFoundError)
  const choice = await Choice.findOne({where: {id: expectedData.choices[0].id}})
  expect(choice.selectedCount).toEqual(0)
})
