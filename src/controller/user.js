const {
  getOneUser,
  createUser,
  deleteUser,
  updateUser,
  updatePassword,
  getUsersByGrade
} = require('../services/user')
const {createGrade, updateGrade} = require('../services/grade')
const seq = require('../db/seq')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const {doCrypto,deCryptId,enCryptId} = require('../utils/cryp')
const {
  registerFailInfo,
  loginFailInfo,
  deleteUserFailInfo,
  changeInfoFailInfo,
  registerUserNameExistInfo,
  getInfoFailInfo,
  changePasswordFailInfo,
  getGradePeopleFailInfo
} = require('../model/ErrorInfo')

async function register(ctx, { userName, password, gender, fullName, role, gradeId, gradeName, school, major,studentNumber }) {
  let t = null
  try {
    t = await seq.transaction();
    const userInfo = await getOneUser({userName})
    if (userInfo) {
      // 用户名已存在
      return new ErrorModel(registerUserNameExistInfo)
    }
    if (gradeId) {
      gradeId = deCryptId(gradeId)
    }
    let newGrade = null
    if (role === 'admin') {
      newGrade = await createGrade({
        major,
        school,
        gradeName,
        peopleNum: 0
      },{transaction:t})
      gradeId = newGrade.id
    }
    const newUser = await createUser({
      userName,
      password: doCrypto(password),
      gender,
      fullName,
      role,
      gradeId,
      studentNumber
    },{transaction:t})
    newUser.gradeId = enCryptId(newUser.gradeId)
    if (newGrade) {
      Object.assign(newUser, newGrade)
    }
    ctx.session.userInfo = newUser
    await t.commit()
    return new SuccessModel(newUser)
  } catch (ex) {
    await t.rollback()
    console.error(ex.message, ex.stack)
    return new ErrorModel(registerFailInfo)
  }
}

async function login(ctx, {userName, password}) {
  try {
    // 获取用户信息
    const userInfo = await getOneUser({userName, password:doCrypto(password)})
    if (!userInfo) {
        // 登录失败
      return new ErrorModel(loginFailInfo)
    }
    userInfo.gradeId = enCryptId(userInfo.gradeId)
    if (ctx.session.userInfo == null) {
      ctx.session.userInfo = userInfo
    }
    return new SuccessModel(userInfo)
  }catch (e) {
    console.error(e.message, e.stack)
    return new ErrorModel(loginFailInfo)
  }
}

async function getInfo({id}) {
  // 获取用户信息
  try {
    const userInfo = await getOneUser({id})
    userInfo.gradeId = enCryptId(userInfo.gradeId)
    return new SuccessModel(userInfo)
  } catch(e) {
    console.error(e.message, e.stack)
    return new ErrorModel(getInfoFailInfo)
  }
}

async function findGradeAllPeople ({gradeId}) {
  try {
    const userList = await getUsersByGrade({gradeId:deCryptId(gradeId)})
    return new SuccessModel(userList)
  }catch(e) {
    return new ErrorModel(getGradePeopleFailInfo)
  }
}

async function deleteCurUser(userName) {
  const result = await deleteUser(userName)
  if (result) {
    // 成功
    return new SuccessModel()
  }
  // 失败
  return new ErrorModel(deleteUserFailInfo)
}

async function changeInfo(ctx, { userName, gender, fullName, gradeName, school, major, studentNumber }) {
  let t = null
  try {
    t = await seq.transaction();
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
    let updatedUser = null, updatedGrade = null
    if (JSON.stringify(updateUserData)!='{}') {
      updatedUser = await updateUser(
        { userName, gender, fullName,gradeName, school, major, studentNumber, id:ctx.session.userInfo.id },
        {transaction:t}
      )
    }

    if (JSON.stringify(updateGradeData)!='{}' && ctx.session.userInfo.role=='admin') {
      updatedGrade = await updateGrade({
        gradeName,
        major,
        school,
        gradeId: deCryptId(ctx.session.userInfo.gradeId)
      },{transaction:t})
    }

    if (updatedUser) {
      // 执行成功
      if (userName) {
        ctx.session.userInfo.userName = userName  
      }
      if (gender) {
        ctx.session.userInfo.gender = gender
      }
      if (fullName) {
        ctx.session.userInfo.fullName = fullName
      }
      if (studentNumber) {
        ctx.session.userInfo.studentNumber = studentNumber
      }
    }

    if (updatedGrade) {
      if (gradeName) {
        ctx.session.userInfo.gradeName = gradeName
      }
      if (school) {
        ctx.session.userInfo.school = school
      }
      if (major) {
        ctx.session.userInfo.major = major
      }
    }
    await t.commit()
    return new SuccessModel()
  } catch (e) {
    // 失败
    console.error(e.message, e.stack)
    await t.rollback()
    return new ErrorModel(changeInfoFailInfo)
  }
}

async function changePassword (
  ctx,
  {oldPassword, newPassword}
) {
  try {
    const userInfo = await getOneUser({id:ctx.session.userInfo.id,password:doCrypto(oldPassword)})
    if (!userInfo) {
      return new ErrorModel(changePasswordFailInfo)
    }
    await updatePassword({password:doCrypto(newPassword)},ctx.session.userInfo.id)
    return new SuccessModel()
  }catch(e) {
    console.log(e.message,e.stack)
    return new ErrorModel(changePasswordFailInfo)
  }
}

async function logout(ctx) {
  delete ctx.session.userInfo
  return new SuccessModel()
}

module.exports = {
  register,
  login,
  logout,
  deleteCurUser,
  changeInfo,
  getInfo,
  changePassword,
  findGradeAllPeople
}
