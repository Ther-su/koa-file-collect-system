const seq = require('../seq')
const Grade = require('./Grade')
const { STRING, DECIMAL } = require('../types')

// users
const User = seq.define('user', {
  userName: {
    type: STRING,
    allowNull: false,
    comment: '用户名'
  },
  fullName: {
    type: STRING,
    allowNull: false,
    comment: '姓名'
  },
  password: {
    type: STRING,
    allowNull: false,
    comment: '密码'
  },
  gender: {
    type: DECIMAL,
    allowNull: false,
    comment: '性别（1 男性，2 女性）'
  },
  studentNumber: {
    type: STRING,
    allowNull: false,
    comment: '学号'
  },
  role: {
    type: STRING,
    allowNull: false,
    comment: '角色（1 管理员，2 学生）'
  }
},{
  timestamps: false
})
User.afterCreate(async (user,option)=>{
  Grade.increment('peopleNum',{where:{
    id: user.gradeId
  }},
  {
    transaction: option.transaction
  })
})

module.exports = User