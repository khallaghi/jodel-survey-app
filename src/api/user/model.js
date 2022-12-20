import {orm} from '../../services/sequelize'
import bcrypt from 'bcryptjs'
import {DataTypes, Model} from "sequelize";
import {AlreadyExistError, NotFoundError, UnauthorizedError} from "../../services/utils/error";

const SALT = 9

class User extends Model {
  static async createUser(username, password) {
    const user = await User.findOne({
      where: {username}
    })
    const hashedPassword = bcrypt.hashSync(password, SALT)
    if (!user)
      return await User.create({username, hashedPassword})
    throw new AlreadyExistError('This username already exist.')
  }

  static async getUser(username, password) {
    const user = await User.findOne({
      where: {
        username
      }
    })
    if (!user)
      throw new NotFoundError('User not found')
    const isPasswordValid = bcrypt.compareSync(
      password,
      user.hashedPassword
    )
    if (!isPasswordValid)
      throw new UnauthorizedError('Unauthorized')

    return user
  }

  static async getUserById(userId) {
    return await User.findOne({
      where: {
        id: userId
      }
    })
  }
}

User.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    hashedPassword: {
      type: DataTypes.STRING(255),
      allowNull: false
    }
  },
  {
    sequelize: orm,
    modelName: 'User'
  })



export default User
