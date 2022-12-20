import request from 'supertest'
import {apiRoot} from '../../config'
import express from '../../services/express'
import routes from '.'
import {initDbWithMultipleData, initDbWithNoData, initDbWithOneData} from "../../../test/initialization"
import {deepReplace} from "../../../test/utils";
import {jwtSign} from "../../services/jwt";

const app = () => express(apiRoot, routes)

const getToken = (userId) => {
  return jwtSign(userId)
}
describe('Test response of all surveys', () => {
  it('GET /survey 201', async () => {
    const {expectedUserBody} = await initDbWithOneData()
    const expectedBody = {
      "totalCount": 1,
      "edges": [
        {
          "node": {
            "id": 'RANDOM_STRING',
            "question": "hello how are you?",
            "createdAt": "RANDOM_STRING",
            "choices": [
              {
                "localId": 0,
                "text": "very good"
              },
              {
                "localId": 1,
                "text": "not bad"
              },
              {
                "localId": 2,
                "text": "very very bad"
              }
            ],
            "user": {
              "username": expectedUserBody.username
            }
          },
          "cursor": "RANDOM_STRING"
        }
      ],
      "pageInfo": {
        "hasNextPage": false,
        "hasPreviousPage": false,
        "startCursor": "RANDOM_STRING",
        "endCursor": "RANDOM_STRING"
      }
    }
    const token = getToken(expectedUserBody.id)
    let {status, body} = await request(app()).get(`${apiRoot}`).set('x-access-token', token)
    deepReplace(body, ['startCursor', 'endCursor', 'cursor', 'createdAt', 'id'], 'RANDOM_STRING')
    expect(status).toBe(200)
    expect(body).toMatchObject(expectedBody)
  })

  it('GET /survey?withResult=true 200', async () => {
    const {expectedUserBody} = await initDbWithOneData()
    const expectedBody = {
      "totalCount": 1,
      "edges": [
        {
          "node": {
            "id": 'RANDOM_STRING',
            "question": "hello how are you?",
            "createdAt": "RANDOM_STRING",
            "choices": [
              {
                "localId": 0,
                "text": "very good",
                "selectedCount": 0
              },
              {
                "localId": 1,
                "text": "not bad",
                "selectedCount": 0
              },
              {
                "localId": 2,
                "text": "very very bad",
                "selectedCount": 0
              }
            ],
            "user": {
              "username": expectedUserBody.username
            }
          },
          "cursor": "RANDOM_STRING"
        }
      ],
      "pageInfo": {
        "hasNextPage": false,
        "hasPreviousPage": false,
        "startCursor": "RANDOM_STRING",
        "endCursor": "RANDOM_STRING"
      }
    }
    const token = getToken(expectedUserBody.id)
    let {status, body} = await request(app()).get(`${apiRoot}?withResult=true`).set('x-access-token', token)
    deepReplace(body, ['startCursor', 'endCursor', 'cursor', 'createdAt', 'id'], 'RANDOM_STRING')
    expect(status).toBe(200)
    expect(body).toMatchObject(expectedBody)
  })

  it('GET /survey?withResult=true&limit=2 200', async () => {
    const {expectedUserBodies} = await initDbWithMultipleData()
    const expectedBody = {
      "totalCount": 2,
      "edges": [
        {
          "node": {
            "id": 'RANDOM_STRING',
            "question": "hello how are you buddy for first time? ",
            "createdAt": "RANDOM_STRING",
            "choices": [
              {
                "localId": 0,
                "text": "very good bud 1",
                "selectedCount": 0
              },
              {
                "localId": 1,
                "text": "not bad bud 1",
                "selectedCount": 0
              },
              {
                "localId": 2,
                "text": "very very bad bud 1",
                "selectedCount": 0
              }
            ],
            "user": {
              "username": expectedUserBodies[0].username
            }
          },
          "cursor": "RANDOM_STRING"
        },
        {
          "node": {
            "id": 'RANDOM_STRING',
            "question": "hello how are you for second time?",
            "createdAt": "RANDOM_STRING",
            "choices": [
              {
                "localId": 0,
                "text": "very good 2",
                "selectedCount": 0
              },
              {
                "localId": 1,
                "text": "not bad 2",
                "selectedCount": 0
              },
              {
                "localId": 2,
                "text": "very very bad 2",
                "selectedCount": 0
              }
            ],
            "user": {
              "username": expectedUserBodies[0].username
            }
          },
          "cursor": "RANDOM_STRING"
        }
      ],
      "pageInfo": {
        "hasNextPage": false,
        "hasPreviousPage": false,
        "startCursor": "RANDOM_STRING",
        "endCursor": "RANDOM_STRING"
      }
    }
    const token = getToken(expectedUserBodies[0].id)
    let {status, body} = await request(app()).get(`${apiRoot}?withResult=true&limit=2`).set('x-access-token', token)
    deepReplace(body, ['startCursor', 'endCursor', 'cursor', 'createdAt', 'id'], 'RANDOM_STRING')
    expect(status).toBe(200)
    expect(body).toMatchObject(expectedBody)
  })
  it('GET /survey?withResult=true&limit=2 200 should be empty', async () => {
    const {expectedUserBody} = await initDbWithNoData()
    const expectedBody = {
      "totalCount": 0,
      "edges": [],
      "pageInfo": {
        "hasNextPage": false,
        "hasPreviousPage": false,
        "startCursor": null,
        "endCursor": null
      }
    }
    const token = getToken(expectedUserBody.id)
    console.log(token)
    let {status, body} = await request(app()).get(`${apiRoot}?withResult=true&limit=2`).set('x-access-token', token)
    console.log(body)
    expect(status).toBe(200)
    expect(body).toMatchObject(expectedBody)
  })
})

describe('Test response of specific survey', () => {
  it('/survey/random 400', async () => {
    let {status} = await request(app()).get(`${apiRoot}/random`)
    expect(status).toBe(404)
  })

  it('/survey/1 200', async () => {
    const {expectedSurvey} = await initDbWithOneData()
    const expectedBody = {
      "id": `${expectedSurvey.id}`,
      "question": "hello how are you?",
      "createdAt": "RANDOM_STRING",
      "choices": [
        {
          "localId": 0,
          "text": "very good"
        },
        {
          "localId": 1,
          "text": "not bad"
        },
        {
          "localId": 2,
          "text": "very very bad"
        }
      ]
    }
    let {status, body} = await request(app()).get(`${apiRoot}/${expectedSurvey.id}`)
    deepReplace(body, ['createdAt'], 'RANDOM_STRING')
    expect(status).toBe(200)
    expect(body).toMatchObject(expectedBody)
  })

  it('/survey/1?withResult=true 200', async () => {
    const {expectedSurvey} = await initDbWithOneData()
    const expectedBody = {
      "id": `${expectedSurvey.id}`,
      "question": "hello how are you?",
      "createdAt": "RANDOM_STRING",
      "choices": [
        {
          "localId": 0,
          "text": "very good",
          "selectedCount": 0
        },
        {
          "localId": 1,
          "text": "not bad",
          "selectedCount": 0
        },
        {
          "localId": 2,
          "text": "very very bad",
          "selectedCount": 0
        }
      ]
    }
    let {status, body} = await request(app()).get(`${apiRoot}/${expectedSurvey.id}?withResult=true`)
    deepReplace(body, ['createdAt'], 'RANDOM_STRING')
    expect(status).toBe(200)
    expect(body).toMatchObject(expectedBody)
  })
  it('Access without authorization', async () => {
    await initDbWithOneData()
    const {status, body} = await request(app()).get(`${apiRoot}`)
    expect(status).toBe(401)
    expect(body.message).toBeDefined()
  })
})

describe('Test creating a survey', () => {
  it('POST /survey 200', async () => {
    const {expectedUserBody} = await initDbWithNoData()
    const postBody = {
      "question": "hello how are you?",
      "choices": [
        {"text": "very good"},
        {"text": "not bad"},
        {"text": "very very bad"}
      ]
    }
    const token = getToken(expectedUserBody.id)
    const {status, body} = await request(app())
      .post(`${apiRoot}`)
      .send(postBody)
      .set('x-access-token', token)
    expect(status).toBe(200)
    expect(typeof body).toEqual('object')
  })
})

describe('Test answering a survey', () => {
  it('Answer to survey', async () => {
    await initDbWithOneData()
    const {status} = await request(app())
      .post(`${apiRoot}/e39d7548-917b-4605-aba3-1444869d6988/answer`)
      .send({selectedLocalId: 1})
    expect(status).toBe(200)
  })

  it('wrong survey id format', async () => {
    await initDbWithOneData()
    const {status, body} = await request(app())
      .post(`${apiRoot}/e39drandom7548-917b-4605-aba3-1444869d6988/answer`)
      .send({selectedLocalId: 1})
    expect(status).toBe(400)
    expect(body.message).toBeDefined()
  })
})

describe('Test destroying a survey', () => {
  it('Destroy survey without authorization', async () => {
    const {expectedSurvey} = await initDbWithOneData()
    const {status, body} = await request(app())
      .delete(`${apiRoot}/${expectedSurvey.id}`)
    expect(status).toBe(401)
    expect(body.message).toBeDefined()
  })

  it('Destroy survey with authorization', async () => {
    const {expectedSurvey, expectedUser} = await initDbWithOneData()
    const token = getToken(expectedUser.id)
    const {status, body} = await request(app())
      .delete(`${apiRoot}/${expectedSurvey.id}`)
      .set('x-access-token', token)
    expect(status).toBe(200)
    expect(body.message).toBeDefined()
  })

  it('Access with bad uuid', async () => {
    const {expectedSurvey, expectedUser} = await initDbWithOneData()
    const token = getToken(expectedUser.id)
    const {status, body} = await request(app())
      .delete(`${apiRoot}/${expectedSurvey.id}random`)
      .set('x-access-token', token)
    expect(status).toBe(400)
    expect(body.message).toBeDefined()
  })
})

