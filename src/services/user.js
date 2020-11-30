const {User,Grade} = require('../db/model')
const {createGrade} = require('./grade')
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

async function createUser({ userName, password, gender, gradeId, role, fullName, major, school, gradeName, studentNumber }) {
  const t = await seq.transaction();
  try {
    let gradeRes
    if (role === 'admin') {
      gradeRes = await createGrade({
        major,
        school,
        gradeName,
        peopleNum: 0
      },{transaction:t})
      gradeId = gradeRes.id
    }
    const result = await User.create({
      password,
      userName,
      gender,
      role,
      gradeId,
      fullName,
      studentNumber
    },{transaction:t})
    await t.commit()
    const {dataValues} = result
    dataValues.gradeId = gradeId
    return dataValues
  } catch(error) {
    await t.rollback()
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
  { gender, userName, fullName, gradeName, school, major, studentNumber},
  id,
  gradeId,
  role
) {
  // 拼接修改内容
  const t = await seq.transaction();
  const updateUserData = {}
  const updateGradeData = {}
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
  if (gradeName) {
    updateGradeData.gradeName = gradeName
  }
  if (school) {
    updateGradeData.school = school
  }
  if (major) {
    updateGradeData.major = major
  }
  try {
    if (JSON.stringify(updateUserData)!='{}') {
      await User.update(updateUserData, {
        where: {
          id
        },
      },{transaction:t})
    }
    if (JSON.stringify(updateGradeData)!='{}' && role=='admin') {
      await Grade.update(updateGradeData,{
        where: {
          id:gradeId
        }
      },{transaction:t})
    }
    await t.commit()
  } catch(e) {
    await t.rollback()
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