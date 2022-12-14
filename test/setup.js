import {EventEmitter} from 'events'
import {closeDb, setupDb} from "../src/services/sequelize";
import Survey from '../src/api/survey/models/survey'
import Choice from '../src/api/survey/models/choice'
import User from '../src/api/user/model'

EventEmitter.defaultMaxListeners = Infinity
jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

global.Array = Array
global.Date = Date
global.Function = Function
global.Math = Math
global.Number = Number
global.Object = Object
global.RegExp = RegExp
global.String = String
global.Uint8Array = Uint8Array
global.WeakMap = WeakMap
global.Set = Set
global.Error = Error
global.TypeError = TypeError
global.parseInt = parseInt
global.parseFloat = parseFloat


beforeAll(async () => {
  await setupDb()
})

afterAll(async () => {
  await closeDb()
})

afterEach(async () => {
  await Choice.destroy({truncate: true})
  await Survey.destroy({truncate: true})
  await User.destroy({truncate: true})
})
