import orm from '../../../services/sequelize'
import {DataTypes, Model} from "sequelize";

class Choice extends Model {}

Choice.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  localId: {
    type: DataTypes.INTEGER,
    unique: 'within_survey'
  },
  surveyId: {
    type: DataTypes.INTEGER,
    foreignKey: true,
    unique: 'within_survey'
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
