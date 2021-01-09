const Koa = require('koa')
var cors = require('koa2-cors')
const app = new Koa()
const path = require('path')
const static = require('koa-static')
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
//const bodyparser = require('koa-bodyparser')
const koaBody = require('koa-body')
const logger = require('koa-logger')
const redisStore = require('koa-redis')
const session = require('koa-generic-session')
const { SESSION_SECRET_KEY } = require('./conf/secretKeys')
const { REDIS_CONF } = require('./conf/db')
const { isProd } = require('./utils/env')


const user = require('./routes/user')
const task = require('./routes/task')

// error handler
let onerrorConf = {}
if (isProd) {
  onerrorConf = {
    redirect: '/error'
  }
}
onerror(app, onerrorConf)

// middlewares
// app.use(bodyparser({
//   enableTypes:['json', 'form', 'text']
// }))
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 2000 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
  }
}))
app.use(cors({
  credentials: true
}))
app.use(json())
app.use(logger())
app.use(static(path.join(__dirname, 'public')))
app.use(static( './dist'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// session 配置
app.keys = [SESSION_SECRET_KEY]
app.use(session({
    key: 'koa.sid', // cookie name 默认是 `koa.sid`
    prefix: 'koa:sess:', // redis key 的前缀，默认是 `koa:sess:`
    cookie: {
      path: '/',
      httpOnly: false,
      signed: true,
      maxAge: 24 * 60 * 60 * 1000  // 单位 ms
    },
    store: redisStore({
      all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
    })
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(user.routes(), user.allowedMethods())
app.use(task.routes(), task.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
