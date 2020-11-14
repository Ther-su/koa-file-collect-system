const router = require('koa-router')()
const {
    register,
    login,
    changeInfo,
    logout,
    getInfo,
    changePassword
} = require('../controller/user')
const { loginCheck } = require('../middlewares/loginCheck')


router.prefix('/api')

router.post('/user/register', async (ctx, next) => {
  const { userName, password, gender, role, fullName, gradeId, school, gradeName, major } = ctx.request.body
  ctx.body = await register(ctx, {
    userName,
    password,
    gender,
    role,
    fullName,
    gradeName,
    school,
    major,
    gradeId
  })
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
  const { userName, gender, fullName, gradeName, school, major } = ctx.request.body
  ctx.body = await changeInfo(ctx, { userName, gender, fullName, gradeName, school, major })
})

router.put('/user/password', loginCheck, async (ctx,  next) => {
  const { oldPassword, newPassword } = ctx.request.body
  ctx.body = await changePassword(ctx, { oldPassword, newPassword })
})

router.put('/user/logout', async (ctx, next) => {
  ctx.body = await logout(ctx)
})

module.exports = router
