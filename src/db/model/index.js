const User = require('./User')
const Grade = require('./Grade')
const Task = require('./Task')
const TaskSubmit = require('./TaskSubmit')
// require('../sync')
Grade.hasMany(User)
User.belongsTo(Grade)
Task.belongsTo(Grade)
Task.hasMany(TaskSubmit)
TaskSubmit.belongsTo(Task)
TaskSubmit.belongsTo(User)
module.exports = {
  User,
  Grade,
  Task,
  TaskSubmit
}

