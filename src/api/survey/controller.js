import Survey from './models/survey'

export const create = async ({body}, res, next) => {
  Survey.create(body)
    .then(() => {
      res.status(201).json({
        "message": "Survey has been created"
      })
    })
    .catch((error) => {
      res.status(500).json({
        "error": error.toString()
      })
    })
}

export const index = ({querymen: {query, select, cursor}}, res, next) => {
  Survey.findAll()
  res.status(200).json([])
}

export const show = ({params}, res, next) =>
  res.status(200).json({})

export const update = ({body, params}, res, next) =>
  res.status(200).json(body)

export const destroy = ({params}, res, next) =>
  res.status(204).end()
