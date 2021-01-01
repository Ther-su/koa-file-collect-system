const router = require('koa-router')()
const {
  adminRegister,
  studentRegister,
  login,
  changeInfo,
  logout,
  getInfo,
  changePassword,
  findGradeAllPeople
} = require('../controller/user')
const { loginCheck } = require('../middlewares/loginCheck')


router.prefix('/api')

router.post('/user/register', async (ctx, next) => {
  const { userName, password, gender, role, fullName, gradeId, school, gradeName, major, studentNumber } = ctx.request.body
  let registerUser = null;
  if (role=='admin') {
    registerUser = await adminRegister(ctx, {
      userName,
      password,
      gender,
      role,
      fullName,
      gradeName,
      school,
      major,
      gradeId,
      studentNumber
    })
  } else {
    console.log('进入')
    registerUser = await studentRegister(ctx, {
      userName,
      password,
      gender,
      role,
      fullName,
      gradeId,
      studentNumber
    })
  }
  ctx.body = registerUser
})


router.get('/user/info', loginCheck,async (ctx, next) => {
  const { id } = ctx.session.userInfo
  ctx.body = await getInfo({id})
})

router.post('/user/login', async (ctx, next) => {
  const { userName, password } = ctx.request.body
  ctx.body = await login(ctx, { userName, password })
})

router.put('/user/modify', loginCheck, async (ctx,  next) => {
  const { userName, gender, fullName, gradeName, school, major, studentNumber } = ctx.request.body
  ctx.body = await changeInfo(ctx, { userName, gender, fullName, gradeName, school, major, studentNumber })
})

router.put('/user/password', loginCheck, async (ctx,  next) => {
  const { oldPassword, newPassword } = ctx.request.body
  ctx.body = await changePassword(ctx, { oldPassword, newPassword })
})

router.put('/user/logout',loginCheck, async (ctx, next) => {
  ctx.body = await logout(ctx)
})

router.get('/grade/people', loginCheck, async (ctx, next) => {
  ctx.body = await findGradeAllPeople({gradeId: ctx.session.userInfo.gradeId})
})

module.exports = router
