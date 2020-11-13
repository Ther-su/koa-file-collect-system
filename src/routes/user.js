const router = require('koa-router')()
const {
    register,
    login,
    changeInfo,
    logout,
    getInfo
} = require('../controller/user')



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


router.get('/user/info', async (ctx, next) => {
  const { id } = ctx.session.userInfo
  ctx.body = await getInfo({id})
})

router.put('/user/info', async (ctx, next) => {
  const { id } = ctx.session.userInfo
  ctx.body = await getInfo({id})
})

router.post('/user/login', async (ctx, next) => {
  const { userName, password } = ctx.request.body
  ctx.body = await login(ctx, { userName, password })
})

router.patch('/user/update',  async (ctx, next) => {
  const { nickName, gender, passowrd } = ctx.request.body
  ctx.body = await changeInfo(ctx, { nickName, gender, passowrd })
})

router.put('/user/logout', async (ctx, next) => {
  ctx.body = await logout(ctx)
})

module.exports = router
