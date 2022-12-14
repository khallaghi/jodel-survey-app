import {Sequelize} from 'sequelize'
import { db } from '../../config'

const orm = new Sequelize(db)

export default orm
