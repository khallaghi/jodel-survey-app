import Survey from './survey'
import Choice from './choice'
import {initDbWithMultipleData, initDbWithOneData} from "../../../../test/initialization";
import User from "../../user/model";

describe('Check validity of query options', () => {
  it('Check availability of attributes field', async () => {
    const actualQueryOptions = Survey.getQueryOptions()
    const expectedSurveyKeys = Object.keys(await Survey.describe())
    const expectedChoiceKeys = Object.keys(await Choice.describe())
    const expectedUserKeys = Object.keys(await User.describe())
    expect(expectedSurveyKeys).toEqual(expect.arrayContaining(actualQueryOptions.attributes))
    expect(expectedChoiceKeys).toEqual(expect.arrayContaining(actualQueryOptions.include[0].attributes))
    expect(expectedUserKeys).toEqual(expect.arrayContaining(actualQueryOptions.include[1].attributes))
  })

  it('Check availability of order keys', async () => {
    const queryOptions = Survey.getQueryOptions()
    const expectedSurveyKeys = Object.keys(await Survey.describe())
    const expectedChoiceKeys = Object.keys(await Choice.describe())
    const actualOrderKey = queryOptions.order[0][0]
    const actualChoiceOrderKey = queryOptions.include[0].order[0][0]
    expect(expectedSurveyKeys).toContain(actualOrderKey)
    expect(expectedChoiceKeys).toContain(actualChoiceOrderKey)
  })

  it('Check functionality of with Results', () => {
    const actualAttrsWithResults = Survey.getQueryOptions(undefined, "true").include[0].attributes
    expect(actualAttrsWithResults.includes('selectedCount')).toBeTruthy()
    const actualAttrsWithoutResults = Survey.getQueryOptions(undefined, "false").include[0].attributes
    expect(actualAttrsWithoutResults.includes('selectedCount')).toBeFalsy()
  })

  it('Check functionality of other attributes', () => {
    const limit = 45
    const after = 'randomstring1'
    const before = 'randomstring2'
    const actualQueryOption = Survey.getQueryOptions(undefined, undefined, {limit, after, before})
    expect(actualQueryOption.limit).toEqual(limit)
    expect(actualQueryOption.after).toEqual(after)
    expect(actualQueryOption.before).toEqual(before)
  })

  it('Check availability of where attribute', () => {
    const expectedWhereClause = {id: 4}
    const actualQueryOption = Survey.getQueryOptions(expectedWhereClause)
    expect(actualQueryOption.where).toEqual(expectedWhereClause)
  })
})

describe('Check CRUD operation on survey', () => {

  it('Check creation of a survey', async () => {
    const {expectedSurveyBody, expectedSurvey} = await initDbWithOneData()
    const actualSurvey = await Survey.findOne({
      where: {id: expectedSurvey.id}, include: {model: Choice, as: 'choices', order: [['localId', 'DESC']]}
    })
    expect(actualSurvey.question).toEqual(expectedSurveyBody.question)
    for (let i = 0; i < expectedSurveyBody.choices.length; i++) {
      expect(actualSurvey.choices[i].text).toEqual(expectedSurveyBody.choices[i].text)
      expect(actualSurvey.choices[i].localId).toEqual(i)
      expect(actualSurvey.choices[i].selectedCount).toEqual(0)
    }

  })

  it('Check getting a survey', async () => {
    const {expectedSurveyBody, expectedSurvey, expectedUserBody} = await initDbWithOneData()
    const actualSurveyWithoutResult = await Survey.getById(expectedSurvey.id)
    console.log(actualSurveyWithoutResult)
    expect(actualSurveyWithoutResult.user).toBeDefined()
    expect(actualSurveyWithoutResult.user.username).toEqual(expectedUserBody.username)
    expect(actualSurveyWithoutResult.question).toEqual(expectedSurveyBody.question)
    expect(actualSurveyWithoutResult.choices).toBeDefined()
    expect(actualSurveyWithoutResult.choices[0].selectedCount).toBeUndefined()
    expect(actualSurveyWithoutResult.choices.length).toEqual(expectedSurveyBody.choices.length)
    const actualSurveyWithResult = await Survey.getById(expectedSurvey.id, "true")
    expect(actualSurveyWithResult.choices[0].selectedCount).toBeDefined()
  })

  it('Check getting all surveys', async () => {
    const {expectedSurveyBodies, expectedUserBodies} = await initDbWithMultipleData()
    const actualSurveys = await Survey.getAll(expectedUserBodies[0].id)

    expect(actualSurveys.totalCount).toEqual(2)
    expect(actualSurveys.edges).toBeDefined()
    expect(actualSurveys.edges.length).toEqual(2)
    expect(actualSurveys.pageInfo).toBeDefined()
    for (let i = 0; i < 2; i++) {
      const actualSurvey = actualSurveys.edges[i].node
      expect(actualSurvey.user).toBeDefined()
      expect(actualSurvey.user.username).toEqual(expectedUserBodies[0].username)
      expect(actualSurvey.question).toEqual(expectedSurveyBodies[i].question)
      expect(actualSurvey.choices).toBeDefined()
      expect(actualSurvey.choices[0].selectedCount).toBeUndefined()
      expect(actualSurvey.choices.length).toEqual(expectedSurveyBodies[i].choices.length)
    }
  })

  it('Check getting list of surveys within page and size', async () => {
    const {expectedUserBodies} = await initDbWithMultipleData()
    const limit = 1
    const actualSurveys = await Survey.getAll(expectedUserBodies[0].id, "false", limit)
    expect(actualSurveys.totalCount).toEqual(2)
    expect(actualSurveys.edges).toBeDefined()
    expect(actualSurveys.edges.length).toEqual(limit)
    expect(actualSurveys.pageInfo.hasNextPage).toBeTruthy()
  })

  it('Check getting list of surveys with after', async () => {
    const {expectedUserBodies} = await initDbWithMultipleData()
    const limit = 3
    const surveys = await Survey.getAll(expectedUserBodies[1].id, "false", limit)
    const after = surveys.edges[1].cursor
    const actualSurveys = await Survey.getAll(expectedUserBodies[1].id, "false", limit, after)
    expect(actualSurveys.edges[0].cursor).toEqual(surveys.edges[2].cursor)
    expect(actualSurveys.edges.length).toEqual(2)
  })

  it('Check getting list of surveys with before', async () => {
    const {expectedUserBodies} = await initDbWithMultipleData()
    const limit = 3
    const surveys = await Survey.getAll(expectedUserBodies[1].id, "false", limit)
    const before = surveys.edges[2].cursor
    const actualSurveys = await Survey.getAll(expectedUserBodies[1].id, "false", limit, undefined, before)
    expect(actualSurveys.edges[0].cursor).toEqual(surveys.edges[0].cursor)
    expect(actualSurveys.edges.length).toEqual(limit - 1)
  })

  it('Check getting list of surveys within page and size with results', async () => {
    const {expectedUserBodies} = await initDbWithMultipleData()

    const actualSurveysWithResults = await Survey.getAll(expectedUserBodies[0].id, "true")
    expect(actualSurveysWithResults.edges[0].node.choices[0].selectedCount).toBeDefined()

    const actualSurveysWithoutResults = await Survey.getAll(expectedUserBodies[0].id)
    expect(actualSurveysWithoutResults.edges[0].node.choices[0].selectedCount).toBeUndefined()
  })
})




