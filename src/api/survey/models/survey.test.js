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
    expect(actualAttrsWithoutResults .includes('selectedCount')).toBeFalsy()
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



