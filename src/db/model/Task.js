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
    type: STRING,
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
  canSubmitWhenOverdue: {
    type: STRING,
    allowNull: false,
    defaultValue: '0',
    comment: '过期后是否允许提交,1允许，2不允许'
  },
  picNum: {
    type: INTEGER,
    allowNull: false,
    comment: '图片数量',
    defaultValue: 0
  },
},{
  timestamps: false
})

module.exports = Task