import logger from '../winston'

export const success = (res, entity, status) => {
  if (entity)
    res.status(status || 200).json(entity)
  return null
}

export const notFound = (res, error) => {
  if (error) {
    logger.debug(error)
    res.status(404).json(error)
  } else {
    res.status(404).end()
  }

  return null
}

export const internalError = (res, error) => {
  logger.error(error)
  res.status(500).json({"error": "Internal server error, please try again later."})
  return null
}

export const badRequest = (res, error) => {
  logger.debug(error)
  res.status(400).json(error)
}
