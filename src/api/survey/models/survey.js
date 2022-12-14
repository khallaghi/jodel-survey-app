import orm from '../../../services/sequelize'
import {DataTypes} from "sequelize"
import Choice from "./choice";

const Survey = orm.define('Survey', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: true
  }
})

Survey.hasMany(Choice)

export default Survey




