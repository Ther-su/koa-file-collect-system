const router = require('koa-router')()
const { adminCheck } = require('../middlewares/roleCheck')
const { handleAddTask, handleGetMyTask, handleUploadImg } = require('../controller/task.js')

router.prefix('/api')

router.post('/task/add', adminCheck, async (ctx, next) => {
  const { taskName, taskContent, deadline, checkedStudents, canSubmitWhenOverdue, publishTime } = ctx.request.body

  ctx.body = await handleAddTask(ctx, { taskName, taskContent, deadline, checkedStudents, canSubmitWhenOverdue, publishTime })
})

router.get('/task/my', async (ctx, next) => {
  ctx.body = await handleGetMyTask({ userId: ctx.session.userInfo.id, gradeId: ctx.session.userInfo.gradeId })
})

router.post('/task/pic', async (ctx, next) => {
  const { taskId } = ctx.request.body
  ctx.body = await handleUploadImg(ctx, { taskId })
})

module.exports = router