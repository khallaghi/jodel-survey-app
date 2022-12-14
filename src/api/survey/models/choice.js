import orm from '../../../services/sequelize'
import {DataTypes} from "sequelize";
import Survey from "./survey"

const Choice = orm.define('Choice', {
  id: {
    dataType: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  text: {
    dataType: DataTypes.TEXT
  },
  selectedCount: {
    dataType: DataTypes.INTEGER,
    defaultValue: 0
  }
})

Choice.belongsTo(Survey)

export default Choice
