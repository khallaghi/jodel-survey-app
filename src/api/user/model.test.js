import User from './model'
import {initDbWithNoData} from "../../../test/initialization";
import bcrypt from "bcryptjs";
import {AlreadyExistError, UnauthorizedError} from "../../services/utils/error";


describe('Getting User', () => {
  it('Test getUserById', async () => {
    const {expectedUserBody} = await initDbWithNoData();
    const actualUser = await User.getUserById(expectedUserBody.id)
    expect(actualUser.id).toBe(expectedUserBody.id)
    expect(actualUser.createdAt).toBeTruthy()
    expect(actualUser.updatedAt).toBeTruthy()
    expect(actualUser.username).toEqual(expectedUserBody.username)
    expect(bcrypt.compareSync(expectedUserBody.password, actualUser.hashedPassword)).toBeTruthy()
  })

  it('Test get user', async () => {
    const {expectedUserBody} = await initDbWithNoData()
    const actualUser = await User.getUser(expectedUserBody.username, expectedUserBody.password)
    expect(actualUser.id).toBe(expectedUserBody.id)
    expect(actualUser.username).toEqual(expectedUserBody.username)
    expect(bcrypt.compareSync(expectedUserBody.password, actualUser.hashedPassword)).toBeTruthy()
  })

  it('Test getting user with wrong password', async () => {
    const {expectedUserBody} = await initDbWithNoData()
    await expect(User.getUser(expectedUserBody.username, expectedUserBody.password + 'random'))
      .rejects
      .toThrow(UnauthorizedError)
  })
})

describe('Creating user', () => {
  it('Create a simple user', async () => {
    const username = 'mohammad'
    const password = 'password'
    const actualUser = await User.createUser(username, password)
    expect(actualUser.id).toBeTruthy()
    expect(actualUser.username).toBeDefined()
  })

   it('Create an existing user', async () => {
     const {expectedUserBody} = await initDbWithNoData()
    await expect(User.createUser(expectedUserBody.username, 'password'))
      .rejects
      .toThrow(AlreadyExistError)
  })

})
