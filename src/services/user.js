const {User,Grade} = require('../db/model')
const seq = require('../db/seq')
async function getOneUser({userName,id,password}) {
  // 查询条件
  const whereOpt = {}
  if (userName) {
    whereOpt.userName = userName
  }
  if (password) {
    whereOpt.password = password
  }
  if (id) {
    whereOpt.id = id
  }
  // 查询
  const result = await User.findOne({
    attributes: ['id', 'userName', 'gender', 'gradeId', 'role', 'studentNumber', 'fullName',seq.col('grade.gradeName'),seq.col('grade.school'),seq.col('grade.major')],
    where: whereOpt,
    raw: true,
    include: [
      {
        model:Grade,
        attributes: [],
        where: {
          '$grade.id': seq.col('user.gradeId')
        }
      }
    ],
  })
  
  return result
}

async function createUser({ userName, password, gender, gradeId, role, fullName, major, school, gradeName, studentNumber },{transaction}) {
  const t = await seq.transaction();
  try {
    const result = await User.create({
      password,
      userName,
      gender,
      role,
      gradeId,
      fullName,
      studentNumber
    },{transaction})
    const {dataValues} = result
    dataValues.gradeId = gradeId
    return dataValues
  } catch(error) {
    throw new Error(error)
  }
}

async function deleteUser(id,{transaction}) {
  const result = await User.destroy({
    where: {
      id
    }
  },{transaction})
  // result 删除的行数
  return result > 0
}

async function updateUser(
  { gender, userName, fullName, studentNumber, id, role},
  {transaction}
) {
  // 拼接修改内容
  const updateUserData = {}
  if (gender) {
    updateUserData.gender = gender
  }
  if (userName) {
    updateUserData.userName = userName
  }
  if (studentNumber) {
    updateUserData.studentNumber = studentNumber
  }
  if (fullName) {
    updateUserData.fullName = fullName
  }
  if (role) {
    updateUserData.role = role
  }
  try {
    await User.update(updateUserData, {
      where: {
        id
      },
    },{transaction})
  } catch(e) {
    throw new Error(e)
  }
}

async function updatePassword(
  {password},
  id
) {
  try {
    await User.update({password}, {
      where: {
        id
      },
    })
  }catch(e) {
    throw new Error(e)
  }
}

async function getUsersByGrade ({
  gradeId
}) {
  const result = await User.findAll({
    attributes: ['fullName', 'id', 'studentNumber'],
    raw: true,
    where: {
      gradeId
    }
  })
  return result
}

module.exports = {
  getOneUser,
  createUser,
  deleteUser,
  updateUser,
  updatePassword,
  getUsersByGrade
}