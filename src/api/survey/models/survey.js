import orm from '../../../services/sequelize'
import {DataTypes, Model} from "sequelize"
import Choice from "./choice";
import {makePaginate} from "sequelize-cursor-pagination";
import pull from 'lodash/pull'

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
      order: [['createdAt', 'DESC']],
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
  //
  // static getPagination(page, size) {
  //   const limit = size ? +size : undefined
  //   const offset = page ? page-- * limit : undefined
  //   return {limit, offset}
  // }
  //
  // static getPagingData(data, page, limit) {
  //   const {count: totalItems, rows: surveys} = data
  //   const currentPage = page ? +page : 1
  //   const totalPages = limit ? Math.ceil(totalItems / limit) : 1
  //   return {totalItems, surveys, totalPages, currentPage}
  // }

  static async getAll(withResult, limit, after, before) {
    let queryOptions = Survey.getQueryOptions(undefined, withResult, {limit, after, before, distinct: true})
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
