import Survey from '../src/api/survey/models/survey'
import bcrypt from "bcryptjs";
import User from "../src/api/user/model";

const SALT = 9
export const initDbWithMultipleData = async () => {
  const passwords = ['password', 'password2']

  const expectedUserBodies = [
    {
      "id": "28dcf43d-6f96-425b-af5f-95c2a50c9d2e",
      "username": "mohammad",
      "hashedPassword": bcrypt.hashSync(passwords[0], SALT)
    },
    {
       "id": "27ac42ca-24f8-44f7-b6b7-f32618ed7b40",
      "username": "ali",
      "hashedPassword": bcrypt.hashSync(passwords[1], SALT)
    }
  ]
  for (let i=0; i < expectedUserBodies.length; i++){
    await User.create(expectedUserBodies[i])
    expectedUserBodies[i].password = passwords[i]
  }
  const expectedSurveyBodies =
    [{
      "question": "hello how are you buddy for first time? ",
      "choices": [
        {"text": "very good bud 1", localId: 0},
        {"text": "not bad bud 1", localId: 1},
        {"text": "very very bad bud 1", localId: 2}
      ],
      "userId": expectedUserBodies[0].id
    }, {
      "question": "hello how are you for second time?",
      "choices": [
        {"text": "very good 2", localId: 0},
        {"text": "not bad 2", localId: 1},
        {"text": "very very bad 2", localId: 2}
      ],
      "userId": expectedUserBodies[0].id
    }, {
      "question": "hello how are you for the third time?",
      "choices": [
        {"text": "very good 3", localId: 0},
        {"text": "not bad 3", localId: 1},
        {"text": "very very bad 3", localId: 2}
      ],
      "userId": expectedUserBodies[1].id
    }, {
      "question": "hello how are you fourth time?",
      "choices": [
        {"text": "very good 4", localId: 0},
        {"text": "not bad 4", localId: 1},
        {"text": "very very bad 4", localId: 2}
      ],
      "userId": expectedUserBodies[1].id
    }
    ]
  for (let survey of expectedSurveyBodies)
    await Survey.create(survey, {
      include: [{
        association: Survey.choices,
        as: 'choices'
      }, {
        association: Survey.user,
        as: 'user'
      }]
    })

  return {expectedSurveyBodies, expectedUserBodies}
}

export const initDbWithNoData = async () => {
  const password = 'password'
  const expectedUserBody = {
    "id": "53e9dee1-73c7-4a44-b39a-ea7658827864",
    "username": "mohammad",
    "hashedPassword": bcrypt.hashSync(password, SALT)
  }
  await User.create(expectedUserBody)
  expectedUserBody.password = password
  return {expectedUserBody}
}

export const initDbWithOneData = async () => {
  const password = 'password'
  const expectedUserBody = {
    "id": "53e9dee1-73c7-4a44-b39a-ea7658827864",
    "username": "mohammad",
    "hashedPassword": bcrypt.hashSync(password, SALT)
  }
  const expectedSurveyBody = {
    "id": "e39d7548-917b-4605-aba3-1444869d6988",
    "question": "hello how are you?",
    "choices": [
      {"text": "very good", "localId": 0},
      {"text": "not bad", "localId": 1},
      {"text": "very very bad", "localId": 2}
    ],
    "userId": expectedUserBody.id
  }

  const expectedUser = await User.create(expectedUserBody)
  const expectedSurvey = await Survey.create(expectedSurveyBody, {
    include: [{
      association: Survey.choices,
      as: 'choices'
    }, {
      association: Survey.user,
      as: 'user'
    }]
  })
  expectedUserBody.password = password
  return {expectedSurveyBody, expectedSurvey, expectedUserBody, expectedUser}
}
