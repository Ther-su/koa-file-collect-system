const {
  getOneUser,
  createUser,
  deleteUser,
  updateUser,
  updatePassword,
  getUsersByGrade
} = require('../services/user')
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
  try {
    const userInfo = await getOneUser({userName})
    if (userInfo) {
      // 用户名已存在
      return new ErrorModel(registerUserNameExistInfo)
    }
    if (gradeId) {
      gradeId = deCryptId(gradeId)
    }
    const newUser = await createUser({
      userName,
      password: doCrypto(password),
      gender,
      fullName,
      role,
      gradeId,
      gradeName,
      school,
      major,
      studentNumber
    })
    newUser.gradeId = enCryptId(newUser.gradeId)
    ctx.session.userInfo = newUser
    return new SuccessModel(newUser)
  } catch (ex) {
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
  try {
    const result = await updateUser(
      { userName, gender, fullName,gradeName, school, major, studentNumber },
      ctx.session.userInfo.id,
      deCryptId(ctx.session.userInfo.gradeId),
      ctx.session.userInfo.role
    )
    if (result) {
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
      if (gradeName) {
        ctx.session.userInfo.gradeName = gradeName
      }
      if (school) {
        ctx.session.userInfo.school = school
      }
      if (major) {
        ctx.session.userInfo.major = major
      }
      if (studentNumber) {
        ctx.session.userInfo.studentNumber = studentNumber
      }
    }
    return new SuccessModel()
  } catch (e) {
    // 失败
    console.error(e.message, e.stack)
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
