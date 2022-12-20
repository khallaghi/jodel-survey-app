import Survey from '../src/api/survey/models/survey'

export const initDbWithMultipleData = async () => {
  const expectedBody =
    [{
      "question": "hello how are you buddy for first time? ",
      "choices": [
        {"text": "very good bud 1", localId: 0},
        {"text": "not bad bud 1", localId: 1},
        {"text": "very very bad bud 1", localId: 2}
      ]
    }, {
      "question": "hello how are you for second time?",
      "choices": [
        {"text": "very good 2", localId: 0},
        {"text": "not bad 2", localId: 1},
        {"text": "very very bad 2", localId: 2}
      ]
    }, {
      "question": "hello how are you for the third time?",
      "choices": [
        {"text": "very good 3", localId: 0},
        {"text": "not bad 3", localId: 1},
        {"text": "very very bad 3", localId: 2}
      ]
    }, {
      "question": "hello how are you fourth time?",
      "choices": [
        {"text": "very good 4", localId: 0},
        {"text": "not bad 4", localId: 1},
        {"text": "very very bad 4", localId: 2}
      ]
    }
    ]
  for (let survey of expectedBody)
    await Survey.create(survey, {
      include: {
        association: Survey.choices,
        as: 'choices'
      }
    })

  return {expectedBody}
}

export const initDbWithOneData = async () => {
  const expectedBody = {
    "id": "e39d7548-917b-4605-aba3-1444869d6988",
    "question": "hello how are you?",
    "choices": [
      {"text": "very good", "localId": 0},
      {"text": "not bad", "localId": 1},
      {"text": "very very bad", "localId": 2}
    ]
  }
  const expectedData = await Survey.create(expectedBody, {
      include: {
        association: Survey.choices,
        as: 'choices'
      }
    })
  return {expectedBody, expectedData}
}
