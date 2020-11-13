const seq = require('../seq')
const { STRING, INTEGER } = require('../types')

// users
const Grade = seq.define('grade', {
  school: {
    type: STRING,
    allowNull: false,
    comment: '学校'
  },
  major: {
    type: STRING,
    allowNull: false,
    comment: '专业'
  },
  gradeName: {
    type: STRING,
    allowNull: false,
    comment: '班级名'
  },
  peopleNum: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '班级人数'
  }
},{
  timestamps: false
})
// Grade.sync({ force: true })
module.exports = Grade