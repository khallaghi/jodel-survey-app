import Survey from './survey'
import Choice from './choice'
import orm from '../../../services/sequelize'

beforeAll(async () => {
  await orm.sync({force: true})
    .then(() => {
      console.log("Synced db")
    })
    .catch((err) => {
      console.error("Failed to sync db", err)
    })
})

afterAll(async () => {
  await orm.close()
})

describe('Check validity of query options', () => {
  it('Check availability of attributes field', async () => {
    const actualQueryOptions = Survey.getQueryOptions()
    const expectedSurveyKeys = Object.keys(await Survey.describe())
    const expectedChoiceKeys = Object.keys(await Choice.describe())
    expect(expectedSurveyKeys).toEqual(expect.arrayContaining(actualQueryOptions.attributes))
    expect(expectedChoiceKeys).toEqual(expect.arrayContaining(actualQueryOptions.include.attributes))
  })

  it('Check availability of order keys', async () => {
    const queryOptions = Survey.getQueryOptions()
    const expectedSurveyKeys = Object.keys(await Survey.describe())
    const expectedChoiceKeys = Object.keys(await Choice.describe())
    const actualOrderKey = queryOptions.order[0][0]
    const actualChoiceOrderKey = queryOptions.include.order[0][0]
    expect(expectedSurveyKeys).toContain(actualOrderKey)
    expect(expectedChoiceKeys).toContain(actualChoiceOrderKey)
  })

  it('Check functionality of with Results', () => {
    const actualAttrsWithResults = Survey.getQueryOptions(undefined, "true").include.attributes
    expect(actualAttrsWithResults.includes('selectedCount')).toBeTruthy()
    const actualAttrsWithoutResults = Survey.getQueryOptions(undefined, "false").include.attributes
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
  beforeEach(async () => {
    await Survey.destroy({truncate: true})
  })

  it('Check creation of a survey', async () => {
    const expectedBody = {
      "question": "hello how are you?",
      "choices": [
        {"text": "very good"},
        {"text": "not bad"},
        {"text": "very very bad"}
      ]
    }
    const survey = await Survey.createSurvey(expectedBody)
    const actualSurvey = await Survey.findOne({
      where: {id: survey.id}, include: {model: Choice, as: 'choices', order: [['localId', 'DESC']]}
    })
    expect(actualSurvey.question).toEqual(expectedBody.question)
    for (let i = 0; i < expectedBody.choices.length; i++) {
      expect(actualSurvey.choices[i].text).toEqual(expectedBody.choices[i].text)
      expect(actualSurvey.choices[i].localId).toEqual(i)
      expect(actualSurvey.choices[i].selectedCount).toEqual(0)
    }

  })

  it('Check getting a survey', async () => {
    const expectedSurvey = {
      "question": "hello how are you?",
      "choices": [
        {"text": "very good", localId: 0},
        {"text": "not bad", localId: 1},
        {"text": "very very bad", localId: 2}
      ]
    }
    const survey = await Survey.create(expectedSurvey, {
      include: {
        association: Survey.choices,
        as: 'choices'
      }
    })
    const actualSurveyWithoutResult = await Survey.getById(survey.id)
    expect(actualSurveyWithoutResult).toMatchObject(expectedSurvey)
    const actualSurveyWithResult = await Survey.getById(survey.id, "true")
    expect(actualSurveyWithResult.choices[0].selectedCount).toBeDefined()
  })

  it('Check getting all surveys', async () => {
    const expectedSurveys =
      [{
        "question": "hello how are you buddy? ",
        "choices": [
          {"text": "very good bud", localId: 0},
          {"text": "not bad bud", localId: 1},
          {"text": "very very bad bud", localId: 2}
        ]
      },{
        "question": "hello how are you?",
        "choices": [
          {"text": "very good", localId: 0},
          {"text": "not bad", localId: 1},
          {"text": "very very bad", localId: 2}
        ]
      }]
    await Survey.bulkCreate(expectedSurveys, {
      include: {
        association: Survey.choices,
        as: 'choices'
      }
    })
    const actualSurveys = await Survey.getAll()
    console.log(actualSurveys)
    expect(actualSurveys.totalCount).toEqual(expectedSurveys.length)
    expect(actualSurveys.edges).toBeDefined()
    expect(actualSurveys.edges.length).toEqual(expectedSurveys.length)
    for (let i=0; i < expectedSurveys.length; i++) {
      expect(actualSurveys.edges[i].node).toMatchObject(expectedSurveys[i])
    }
  })
})



