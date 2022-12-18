import Survey from '../src/api/survey/models/survey'

export const initDbWithMultipleData = async () => {
  const expectedBody =
    [{
      "question": "hello how are you buddy? ",
      "choices": [
        {"text": "very good bud", localId: 0},
        {"text": "not bad bud", localId: 1},
        {"text": "very very bad bud", localId: 2}
      ]
    }, {
      "question": "hello how are you?",
      "choices": [
        {"text": "very good", localId: 0},
        {"text": "not bad", localId: 1},
        {"text": "very very bad", localId: 2}
      ]
    }, {
      "question": "hello how are you for the third time?",
      "choices": [
        {"text": "very good", localId: 0},
        {"text": "not bad", localId: 1},
        {"text": "very very bad", localId: 2}
      ]
    }, {
      "question": "hello how are you fourth time?",
      "choices": [
        {"text": "very good", localId: 0},
        {"text": "not bad", localId: 1},
        {"text": "very very bad", localId: 2}
      ]
    }
    ]
  const expectedData = await Survey.bulkCreate(expectedBody, {
    include: {
      association: Survey.choices,
      as: 'choices'
    }
  })

  return {expectedBody, expectedData}
}

export const initDbWithOneData = async () => {
  const expectedBody = {
      "question": "hello how are you?",
      "choices": [
        {"text": "very good"},
        {"text": "not bad"},
        {"text": "very very bad"}
      ]
    }
    const expectedData = await Survey.createSurvey(expectedBody)
  return {expectedBody, expectedData}
}
