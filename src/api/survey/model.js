import orm from '../../services/sequelize'
import {DataTypes} from "sequelize"

const Survey = orm.define('Survey', {
  question: {
    type: DataTypes.STRING,
    allowNull: true
  }
})

export default Survey
