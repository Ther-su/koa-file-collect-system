const seq = require('../seq')
const { STRING, INTEGER, DATE } = require('../types')

// users
const TaskSubmit = seq.define('taskSubmit', {
  status: {
    type: STRING,
    allowNull: false,
    comment: '任务状态,未提交1，已提交2，过期3',
    defaultValue: '1'
  },
  submitTime: {
    type: DATE,
    comment: '提交时间',
    allowNull: true
  },
  fileHash: {
    type: STRING,
    allowNull: true,
    comment: '作业hash值',
    defaultValue: ''
  },
  suffix: {
    type: STRING,
    allowNull: true,
    comment: '文件后缀'
  },
},{
  timestamps: false
})

module.exports = TaskSubmit