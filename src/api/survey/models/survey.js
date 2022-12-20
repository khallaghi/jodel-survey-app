import {orm} from '../../../services/sequelize'
import {DataTypes, Model} from "sequelize"
import Choice from "./choice";
import {makePaginate} from "sequelize-cursor-pagination";
import pull from 'lodash/pull'
import NotFoundError from "../../../services/utils/error";

class Survey extends Model {
  static getQueryOptions(where, withResult, other) {

    let queryOptions = {
      attributes: ['id', 'question', 'createdAt'],
      include: {
        model: Choice,
        as: 'choices',
        attributes: ['localId', 'text', 'selectedCount'],
        order: [['localId', 'DESC']]
      },
      order: [['createdAt', 'ASC']],
    }

    if (withResult !== "true")
      pull(queryOptions.include.attributes, 'selectedCount')

    if (other)
      Object.assign(queryOptions, other)

    if (where)
      Object.assign(queryOptions, {where})

    return queryOptions
  }

  static async createSurvey(body) {
    let {question, choices} = body
    choices = Survey.addOrderIdToChoices(choices)
    const survey = await Survey.create(
      {question, choices}, {
        include: [{
          association: Survey.choices,
          as: 'choices'
        }]
      }
    )
    if (survey)
      return survey.id
  }

  static addOrderIdToChoices(choices) {
    let counter = 0
    choices.forEach(choice => {
      choice.localId = counter
      counter++
    })
    return choices
  }

  static async getAll(withResult, limit, after, before) {
    let queryOptions = Survey.getQueryOptions(undefined, withResult, {limit, after, before, distinct: true})
    console.log(queryOptions)
    const surveys = await Survey.paginate(queryOptions)
    if (surveys)
      return surveys
    throw new NotFoundError('Surveys not found')
  }

  static async getById(id, withResult) {
    let queryOptions = Survey.getQueryOptions({id: id}, withResult)
    const survey = await Survey.findOne(queryOptions)
    if (survey)
      return survey
    throw new NotFoundError('Survey not found')
  }

  static async deleteSurvey(id) {
    const survey = await Survey.findOne({
      where: {
        id: id
      }
    })
    if (survey) {
      await Choice.deleteChoicesBySurveyId(id)
      await survey.destroy()
      return survey.id
    } else {
      throw new NotFoundError('Survey not found')
    }
  }
}

Survey.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  question: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  sequelize: orm,
  modelName: 'Survey'
})


Choice.survey = Choice.belongsTo(Survey, {foreignKey: 'surveyId'})
Survey.choices = Survey.hasMany(Choice, {as: "choices", foreignKey: "surveyId"})

Survey.paginate = makePaginate(Survey)
export default Survey
