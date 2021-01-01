const seq = require('../seq')
const { STRING, INTEGER, DATE } = require('../types')

// users
const TaskRelation = seq.define('taskRelation', {
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
  }
},{
  timestamps: false
})

module.exports = TaskRelation