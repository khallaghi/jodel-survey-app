import orm from '../../../services/sequelize'
import {DataTypes, Model} from "sequelize"
import Choice from "./choice";
import {makePaginate} from "sequelize-cursor-pagination";
import pull from 'lodash/pull'

class Survey extends Model {
  static getQueryOptions(where, withResult, others) {

    let queryOptions = {
      attributes: ['id', 'question', 'createdAt'],
      include: {
        model: Choice,
        as: 'choices',
        attributes: ['localId', 'text', 'selectedCount'],
        order: [['localId', 'DESC']]
      },
      order: [['createdAt', 'DESC']],
    }

    if (withResult !== "true")
      pull(queryOptions.include.attributes, 'selectedCount')

    if (others)
      Object.assign(queryOptions, others)

    if (where)
      Object.assign(queryOptions, {where})

    console.log(queryOptions)
    return queryOptions
  }

  static async createSurvey(body) {
    let {question, choices} = body
    choices = Survey.addOrderIdToChoices(choices)
    return await Survey.create(
      {question, choices}, {
        include: [{
          association: Survey.choices,
          as: 'choices'
        }]
      }
    )
  }

  static addOrderIdToChoices(choices) {
    let counter = 0
    choices.forEach(choice => {
      choice.localId = counter
      counter++
    })
    return choices
  }

  static async getAll(limit, after, before, withResult) {
    console.log({limit, after, before})
    let queryOptions = Survey.getQueryOptions(undefined, withResult, {limit, after, before})
    return await Survey.paginate(queryOptions);
  }

  static async getById(id, withResult) {
    let queryOptions = Survey.getQueryOptions({id: id}, withResult)
    return await Survey.findOne(queryOptions)
  }
}

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


Choice.survey = Choice.belongsTo(Survey, {foreignKey: 'surveyId'})
Survey.choices = Survey.hasMany(Choice, {as: "choices", foreignKey: "surveyId"})

Survey.paginate = makePaginate(Survey)
export default Survey