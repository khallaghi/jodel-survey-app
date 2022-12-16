export const success = (res, entity, status) => {
  res.status(status || 200).json(entity)
}

export const notFound = (res) => {
  res.status(404).end()
  return null
}

export const internalError = (res, error) => {
  console.error(error)
  res.status(500).json({"error": "Internal server error, please try again later."})
  return null
}
export const authorOrAdmin = (res, user, userField) => (entity) => {
  if (entity) {
    const isAdmin = user.role === 'admin'
    const isAuthor = entity[userField] && entity[userField].equals(user.id)
    if (isAuthor || isAdmin) {
      return entity
    }
    res.status(401).end()
  }
  return null
}
