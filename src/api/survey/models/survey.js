import orm from '../../../services/sequelize'
import {DataTypes, Model} from "sequelize"
import Choice from "./choice";

class Survey extends Model {}

Survey.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize: orm,
  modelName: 'Survey'
})

Survey.hasMany(Choice)
Choice.belongsTo(Survey)

export default Survey




