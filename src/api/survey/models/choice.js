import {orm} from '../../../services/sequelize'
import {DataTypes, Model, Op} from "sequelize";
import NotFoundError from "../../../services/utils/error";


class Choice extends Model {
  static async incrementChoice(surveyId, localId) {
    const selectedChoice = await Choice.findOne(
      {
        where: {
          [Op.and]: [
            {surveyId},
            {localId}
          ]
        }
      })
    if (selectedChoice) {
      await selectedChoice.increment('selectedCount', {by: 1})
      return selectedChoice.surveyId
    }
    throw new NotFoundError('Selected choice not found.')
  }

  static async deleteChoicesBySurveyId(surveyId) {
    await Choice.destroy({
      where: {
        surveyId: surveyId
      }
    })
  }
}

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
