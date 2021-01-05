const router = require('koa-router')()
const { adminCheck } = require('../middlewares/roleCheck')
const { 
  handleAddTask, 
  handleGetMyTask, 
  handleUploadImg, 
  handleFileChunk, 
  handleFileMerge, 
  handleTaskOverdue, 
  handleGetPublishedTask, 
  handleVerifyUpload,
  handleGetSubmitSituation 
} = require('../controller/task.js')

router.prefix('/api')

router.post('/task/add', adminCheck, async (ctx, next) => {
  const { taskName, taskContent, deadline, checkedStudents, canSubmitWhenOverdue, publishTime } = ctx.request.body

  ctx.body = await handleAddTask(ctx, { taskName, taskContent, deadline, checkedStudents, canSubmitWhenOverdue, publishTime })
})

router.get('/task/my', async (ctx, next) => {
  const { pageNum, pageSize } = ctx.request.query
  ctx.body = await handleGetMyTask(ctx, { userId: ctx.session.userInfo.id, pageNum, pageSize })
})

router.get('/task/submitSituation', async (ctx, next) => {
  const { taskId } = ctx.request.query
  ctx.body = await handleGetSubmitSituation(ctx, { taskId })
})

router.get('/task/presence', async (ctx, next) => {
  const { hash, fileName } = ctx.request.body
  ctx.body = await handleVerifyUpload(ctx, { hash, fileName })
})

router.get('/task/published',adminCheck, async (ctx, next) => {
  const { pageNum, pageSize } = ctx.request.query
  ctx.body = await handleGetPublishedTask(ctx, { gradeId: ctx.session.userInfo.gradeId, pageNum, pageSize })
})

router.post('/task/pic', async (ctx, next) => {
  const { hash } = ctx.request.body
  ctx.body = await handleUploadImg(ctx, { hash })
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