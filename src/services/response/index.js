export const success = (res, entity, status) => {
  res.status(status || 200).json(entity)
}

export const notFound = (res, error) => {
  res.status(404).json(error)
}

export const internalError = (res, error) => {
  console.error(error)
  res.status(500).json({"error": "Internal server error, please try again later."})
}

export const badRequest = (res, error) => {
  res.status(400).json(error)
}
