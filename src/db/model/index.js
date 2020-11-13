const User = require('./User')
const Grade = require('./Grade')
require('../sync')
Grade.hasMany(User)
User.belongsTo(Grade)

module.exports = {
  User,
  Grade
}