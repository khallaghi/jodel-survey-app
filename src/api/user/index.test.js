import request from 'supertest'
import {apiRoot} from '../../config'
import express from '../../services/express'
import routes from '.'
import {initDbWithNoData} from "../../../test/initialization";

const app = () => express(apiRoot, routes)

test('POST /user 201', async () => {
  const {status, body} = await request(app())
    .post(`${apiRoot}`)
    .send({username: 'mohammad', password: 'password'})
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
})

test('POST /user/login 201', async () => {
  const {expectedUserBody} = await initDbWithNoData()
  const {status, body} = await request(app())
    .post(`${apiRoot}/login`)
    .send({username: expectedUserBody.username, password: expectedUserBody.password})
  expect(status).toEqual(200)
  expect(body.accessToken).toBeDefined()
})

test('POST /user/login 400 wrong password', async () => {
  const {expectedUserBody} = await initDbWithNoData()
  const {status, body} = await request(app())
    .post(`${apiRoot}/login`)
    .send({username: expectedUserBody.username, password: expectedUserBody.password + 'random_string'})
  expect(status).toEqual(400)
  expect(body.accessToken).toBeUndefined()
})


test('POST /user/login 400 wrong username', async () => {
  const {expectedUserBody} = await initDbWithNoData()
  const {status, body} = await request(app())
    .post(`${apiRoot}/login`)
    .send({username: expectedUserBody.username + 'random', password: expectedUserBody.password})
  expect(status).toEqual(404)
  expect(body.accessToken).toBeUndefined()
})
