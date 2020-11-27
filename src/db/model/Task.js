const seq = require('../seq')
const { STRING, INTEGER } = require('../types')

// users
const Task = seq.define('task', {
  taskName: {
    type: STRING,
    allowNull: false,
    comment: '作业名称'
  },
  taskContent: {
    type: STRING,
    allowNull: false,
    comment: '作业内容'
  },
  deadline: {
    type: STRING,
    allowNull: false,
    comment: '截止日期'
  },
  canSubmitWhenOverdue: {
    type: INTEGER,
    allowNull: false,
    defaultValue: 0,
    comment: '过期后是否允许提交,1允许，2不允许'
  }
},{
  timestamps: false
})

module.exports = Task