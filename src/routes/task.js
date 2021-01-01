const router = require('koa-router')()
const { adminCheck } = require('../middlewares/roleCheck')
const { handleAddTask, handleGetMyTask, handleUploadImg, handleFileChunk, handleFileMerge, handleTaskOverdue } = require('../controller/task.js')

router.prefix('/api')

router.post('/task/add', adminCheck, async (ctx, next) => {
  const { taskName, taskContent, deadline, checkedStudents, canSubmitWhenOverdue, publishTime } = ctx.request.body

  ctx.body = await handleAddTask(ctx, { taskName, taskContent, deadline, checkedStudents, canSubmitWhenOverdue, publishTime })
})

router.get('/task/my', async (ctx, next) => {
  ctx.body = await handleGetMyTask(ctx, { userId: ctx.session.userInfo.id, gradeId: ctx.session.userInfo.gradeId })
})

router.post('/task/pic', async (ctx, next) => {
  const { taskId } = ctx.request.body
  ctx.body = await handleUploadImg(ctx, { taskId })
})

router.post('/task/fileChunk', async (ctx, next) => {
  const { taskId, chunkId, fileHash } = ctx.request.body
  ctx.body = await handleFileChunk(ctx, { taskId, chunkId, fileHash })
})

router.post('/task/fileMerge', async (ctx, next) => {
  const { fileHash, fileName, taskId, submitTime } = ctx.request.body
  ctx.body = await handleFileMerge(ctx, { fileHash, fileName, taskId, submitTime })
})

router.post('/task/overdue', async (ctx, next) => {
  const { taskId } = ctx.request.body
  ctx.body = await handleTaskOverdue(ctx, { taskId })
})

module.exports = router