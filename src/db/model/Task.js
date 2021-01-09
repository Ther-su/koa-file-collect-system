const seq = require('../seq')
const { STRING, INTEGER, DATE } = require('../types')

// users
const Task = seq.define('task', {
  taskName: {
    type: STRING,
    allowNull: false,
    comment: '作业名称'
  },
  taskContent: {
    type: STRING(8000),
    allowNull: false,
    comment: '作业内容'
  },
  deadline: {
    type: DATE,
    allowNull: false,
    comment: '截止日期'
  },
  publishTime: {
    type: DATE,
    allowNull: false,
    comment: '截止日期'
  },
},{
  timestamps: false
})

module.exports = Task