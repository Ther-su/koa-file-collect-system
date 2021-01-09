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
  handleGetTaskSubmitList,
  handleUpdateTask,
  handleDeleteTask
} = require('../controller/task.js')
const {
  handleDownloadOneTask
} = require('../controller/taskSubmit.js')
router.prefix('/api')

router.post('/task/add', adminCheck, async (ctx, next) => {
  const { taskName, taskContent, deadline, checkedStudents, publishTime } = ctx.request.body
  ctx.body = await handleAddTask(ctx, { taskName, taskContent, deadline, checkedStudents, publishTime })
})

router.get('/task/my', async (ctx, next) => {
  const { pageNum, pageSize } = ctx.request.query
  ctx.body = await handleGetMyTask(ctx, { userId: ctx.session.userInfo.id, pageNum, pageSize })
})

router.get('/task/submitSituation', async (ctx, next) => {
  const { taskId } = ctx.request.query
  ctx.body = await handleGetTaskSubmitList(ctx, { taskId })
})


router.post('/task/presence', async (ctx, next) => {
  const { hash, fileName } = ctx.request.body
  console.log(hash, fileName)
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

router.put('/task/update', async (ctx, next) => {
  const { taskName, taskContent, deadline, delSubmitters, publishTime, addSubmitters, taskId } = ctx.request.body

  ctx.body = await handleUpdateTask(ctx, { taskName, taskContent, deadline, delSubmitters, publishTime, addSubmitters, taskId })
})

router.get('/task/download', async (ctx, next) => {
  ctx.set('Content-type', 'application/octet-stream')
  const {taskId,userId} = ctx.request.query
  ctx.body = await handleDownloadOneTask(ctx, {taskId,userId})
})

router.post('/task/overdue', async (ctx, next) => {
  const { taskId } = ctx.request.body
  ctx.body = await handleTaskOverdue(ctx, { taskId })
})

router.put('/task/delete', async (ctx, next) => {
  const { taskId } = ctx.request.body
  console.log('taskId',taskId)
  ctx.body = await handleDeleteTask(ctx, { taskId })
})


module.exports = router