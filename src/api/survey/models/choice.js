import orm from '../../../services/sequelize'
import {DataTypes, Model} from "sequelize";
import Survey from "./survey"

class Choice extends Model {}

Choice.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  text: {
    type: DataTypes.TEXT
  },
  selectedCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize: orm,
  modelName: 'Choice'
})


export default Choice
