const User = require('./User')
const Grade = require('./Grade')
const Task = require('./Task')
const TaskRelation = require('./TaskRelation')
//require('../sync')
Grade.hasMany(User)
User.belongsTo(Grade)
Task.belongsTo(Grade)
Task.hasMany(TaskRelation)
TaskRelation.belongsTo(Task)
TaskRelation.belongsTo(User)
module.exports = {
  User,
  Grade,
  Task,
  TaskRelation
}
