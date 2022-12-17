import orm from '../../../services/sequelize'
import {DataTypes, Model} from "sequelize"
import Choice from "./choice";
import {makePaginate} from "sequelize-cursor-pagination";
import pull from 'lodash/pull'

class Survey extends Model {
  static getQueryOptions(where, withResult, limit, offset, distinct) {

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

    if (offset)
      queryOptions.offset = offset
    if (limit)
      queryOptions.limit = limit
    if(distinct)
      queryOptions.distinct = true

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

  static getPagination(page, size) {
    const limit = size ? +size : undefined
    const offset = page ? page * limit : undefined
    return {limit, offset}
  }

  static getPagingData(data, page, limit) {
    const {count: totalItems, rows: surveys} = data
    const currentPage = page ? +page : 1
    const totalPages = limit ? Math.ceil(totalItems / limit) : 1
    return {totalItems, surveys, totalPages, currentPage}
  }

  static async getAll(page, size, withResult) {
    const {limit, offset} = Survey.getPagination(page, size)
    let queryOptions = Survey.getQueryOptions(undefined, withResult, limit, offset, true)
    const results = await Survey.findAndCountAll(queryOptions);
    return Survey.getPagingData(results, page, limit)
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
