import Survey from './model'

export const create = async ({ body }, res, next) => {
  try {
  await Survey.create(body)
  res.status(201).json({
    "message": "Survey has been created"
  })
  } catch (error) {
    res.status(500).json({
      "error": error.toString()
    })
  }
}

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
  res.status(200).json([])

export const show = ({ params }, res, next) =>
  res.status(200).json({})

export const update = ({ body, params }, res, next) =>
  res.status(200).json(body)

export const destroy = ({ params }, res, next) =>
  res.status(204).end()
