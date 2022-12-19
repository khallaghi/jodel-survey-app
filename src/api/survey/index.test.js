import request from 'supertest'
import {apiRoot} from '../../config'
import express from '../../services/express'
import routes from '.'
import {initDbWithMultipleData, initDbWithOneData} from "../../../test/initialization"
import {deepReplace} from "../../../test/utils";

const app = () => express(apiRoot, routes)

describe('Test response of all surveys', () => {
  it('GET /survey 201', async () => {
    await initDbWithOneData()
    const expectedBody = {
      "totalCount": 1,
      "edges": [
        {
          "node": {
            "id": 1,
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
    let {status, body} = await request(app()).get(`${apiRoot}`)
    deepReplace(body, ['startCursor', 'endCursor', 'cursor', 'createdAt'], 'RANDOM_STRING')
    expect(status).toBe(200)
    expect(body).toMatchObject(expectedBody)
  })

  it('GET /survey?withResult=true 200', async () => {
    await initDbWithOneData()
    const expectedBody = {
      "totalCount": 1,
      "edges": [
        {
          "node": {
            "id": 1,
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
    let {status, body} = await request(app()).get(`${apiRoot}?withResult=true`)
    deepReplace(body, ['startCursor', 'endCursor', 'cursor', 'createdAt'], 'RANDOM_STRING')
    expect(status).toBe(200)
    expect(body).toMatchObject(expectedBody)
  })

  it('GET /survey?withResult=true&limit=2 200', async () => {
    await initDbWithMultipleData()
    const expectedBody = {
      "totalCount": 4,
      "edges": [
        {
          "node": {
            "id": 1,
            "question": "hello how are you buddy? ",
            "createdAt": "RANDOM_STRING",
            "choices": [
              {
                "localId": 0,
                "text": "very good bud",
                "selectedCount": 0
              },
              {
                "localId": 1,
                "text": "not bad bud",
                "selectedCount": 0
              },
              {
                "localId": 2,
                "text": "very very bad bud",
                "selectedCount": 0
              }
            ]
          },
          "cursor": "RANDOM_STRING"
        },
        {
          "node": {
            "id": 2,
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
          },
          "cursor": "RANDOM_STRING"
        }
      ],
      "pageInfo": {
        "hasNextPage": true,
        "hasPreviousPage": false,
        "startCursor": "RANDOM_STRING",
        "endCursor": "RANDOM_STRING"
      }
    }
    let {status, body} = await request(app()).get(`${apiRoot}?withResult=true&limit=2`)
    deepReplace(body, ['startCursor', 'endCursor', 'cursor', 'createdAt'], 'RANDOM_STRING')
    expect(status).toBe(200)
    expect(body).toMatchObject(expectedBody)
  })
  it('GET /survey?withResult=true&limit=2 200 should be empty', async () => {
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

    let {status, body} = await request(app()).get(`${apiRoot}?withResult=true&limit=2`)
    expect(status).toBe(200)
    expect(body).toMatchObject(expectedBody)
  })
})

describe('Test response of specific survey', () => {
  it('/survey/1 400', async () => {
    let {status} = await request(app()).get(`${apiRoot}/1`)
    expect(status).toBe(404)
  })

  it('/survey/1 200', async () => {
    await initDbWithOneData()
    const expectedBody = {
      "id": 1,
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
    let {status, body} = await request(app()).get(`${apiRoot}/1`)
    deepReplace(body, ['createdAt'], 'RANDOM_STRING')
    expect(status).toBe(200)
    expect(body).toMatchObject(expectedBody)
  })

  it('/survey/1?withResult=true 200', async () => {
    await initDbWithOneData()
    const expectedBody = {
      "id": 1,
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
    let {status, body} = await request(app()).get(`${apiRoot}/1?withResult=true`)
    deepReplace(body, ['createdAt'], 'RANDOM_STRING')
    expect(status).toBe(200)
    expect(body).toMatchObject(expectedBody)
  })
})


describe('Test creating a survey', () => {
  it('POST /survey 200', async () => {
    const postBody = {
      "question": "hello how are you?",
      "choices": [
        {"text": "very good"},
        {"text": "not bad"},
        {"text": "very very bad"}
      ]
    }
    const {status, body} = await request(app())
      .post(`${apiRoot}`)
      .send(postBody)
    expect(status).toBe(200)
    expect(typeof body).toEqual('object')
  })
})

describe('Test answering a survey', () => {
  it('Answer to survey', async () => {
    await initDbWithOneData()
    const {status} = await request(app())
      .post(`${apiRoot}/1/answer`)
      .send({selectedLocalId: 1})
    expect(status).toBe(200)
  })
})

