import {internalError, notFound, success} from "./index";

let res

beforeEach(() => {
  res = {
    status: jest.fn(() => res),
    json: jest.fn(() => res),
    end: jest.fn(() => res)
  }
})

describe('success', () => {
  it('responds with passed object and status 200', () => {
    expect(success(res, { prop: 'value' })).toBeNull()
    expect(res.status).toBeCalledWith(200)
    expect(res.json).toBeCalledWith({ prop: 'value' })
  })

  it('responds with passed object and status 201', () => {
    expect(success(res, { prop: 'value' }, 201)).toBeNull()
    expect(res.status).toBeCalledWith(201)
    expect(res.json).toBeCalledWith({ prop: 'value' })
  })

  it('does not send any response when object has not been passed', () => {
    expect(success(res, undefined, 201)).toBeNull()
    expect(res.status).not.toBeCalled()
  })
})

describe('notFound', () => {
  it('responds with status 404 when object has not been passed', () => {
    expect(notFound(res)).toBeNull()
    expect(res.status).toBeCalledWith(404)
    expect(res.end).toHaveBeenCalledTimes(1)
  })

  it('responds with status 404 and send the message', () => {
    expect(notFound(res, { prop: 'value' })).toBeNull()
    expect(res.status).toBeCalled()
    expect(res.json).toBeCalled()
  })
})
describe('internalError', () => {
  it('responds with status 500 when object has not been passed', () => {
    expect(internalError(res)).toBeNull()
    expect(res.status).toBeCalledWith(500)
    expect(res.json).toHaveBeenCalledTimes(1)
  })

  it('do not send the passed object', () => {
    expect(notFound(res, { prop: 'value' })).toBeNull()
    expect(res.status).toBeCalled()
    expect(res.json).toBeCalled()
  })
})
