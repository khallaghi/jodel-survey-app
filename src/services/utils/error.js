class NotFoundError extends Error {
  constructor(message) {
    super(message);
  }
}

class AlreadyExistError extends Error {
  constructor(message) {
    super(message);
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
  }
}
export {NotFoundError, AlreadyExistError, UnauthorizedError}
