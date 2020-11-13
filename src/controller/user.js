const {
  getOneUser,
  createUser,
  deleteUser,
  updateUser
} = require('../services/user')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const {doCrypto,deCryptId,enCryptId} = require('../utils/cryp')
const {
  registerFailInfo,
  loginFailInfo,
  deleteUserFailInfo,
  changeInfoFailInfo,
  registerUserNameExistInfo,
  getInfoFailInfo
} = require('../model/ErrorInfo')

async function register(ctx, { userName, password, gender, fullName, role, gradeId, gradeName, school, major }) {
  const userInfo = await getOneUser({userName})
  if (userInfo) {
    // 用户名已存在
    return new ErrorModel(registerUserNameExistInfo)
  }
  try {
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
      major
    })
    ctx.session.userInfo = newUser
    newUser.gradeId = enCryptId(newUser.gradeId)
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
    // 登录成功
    if (ctx.session.userInfo == null) {
      ctx.session.userInfo = userInfo
    }
    return new SuccessModel(userInfo)
  }catch (e) {
    return new ErrorModel(loginFailInfo)
  }
}

async function getInfo({id}) {
  // 获取用户信息
  try {
    const userInfo = await getOneUser({id})
    return new SuccessModel(userInfo)
  } catch(e) {
    return new ErrorModel(getInfoFailInfo)
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

async function changeInfo(ctx, { userName, gender, fullName, gradeName, school, major }) {
  try {
    const result = await updateUser(
      { userName, gender, fullName,gradeName, school, major },
      ctx.session.id,
      deCryptId(ctx.session.gradeId)
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
      return new SuccessModel()
    }
  } catch (e) {
    // 失败
    return new ErrorModel(changeInfoFailInfo)
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
  getInfo
}
