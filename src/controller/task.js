const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { createTask, getMyTask, getPicNum } = require('../services/task')
const { publishTaskFailInfo } = require('../model/ErrorInfo')
const {doCrypto,deCryptId,enCryptId} = require('../utils/cryp')
const { isProd } = require('../utils/env')
const { ifNotExistMkdirs, extractExt } = require('../utils/file')
const fse = require('fs-extra')
const path = require('path')
const UPLOAD_DIR = path.resolve(__dirname, '..', 'public')
const UPLOAD_IMAGE_DIR = path.resolve(UPLOAD_DIR, 'taskImage')

async function handleAddTask(ctx, { taskName, taskContent, deadline, checkedStudents, canSubmitWhenOverdue, publishTime }) {
  try {
    const res = await createTask({taskName, taskContent, deadline, canSubmitWhenOverdue,checkedStudents, publishTime, gradeId: deCryptId(ctx.session.userInfo.gradeId)})
    return new SuccessModel(res)
  }catch (e) {
    console.error(e.message, e.stack)
    return new ErrorModel(publishTaskFailInfo)
  }
}

async function handleGetMyTask ({userId, gradeId}) {
  try {
    const res = await getMyTask({userId, gradeId})
    return new SuccessModel(res)
  }catch (e) {
    console.error(e.message, e.stack)
    return new ErrorModel(publishTaskFailInfo)
  }
}

async function handleUploadImg (ctx, { taskId }) {
  console.log('UPLOAD_IMAGE_DIR', UPLOAD_IMAGE_DIR)
  let remotefilePath = null;
  ifNotExistMkdirs(UPLOAD_IMAGE_DIR)
  const {file} = ctx.request.files 
  if (ctx.request.files['file']) {
    // 创建可读流
    const reader = fse.createReadStream(file.path);
    const IMAGE_PATH = path.resolve(UPLOAD_IMAGE_DIR,ctx.session.userInfo.gradeId)
    ifNotExistMkdirs(IMAGE_PATH)
    const {picNum} = await getPicNum({ taskId })
    let filePath = `${IMAGE_PATH}/${taskId}${extractExt(file.name)}`;
    remotefilePath = `http://localhost:3000/public/taskImage/${taskId}${extractExt(file.name)}`;
    // 创建可写流
    const upStream = fse.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream);
  }
  return new SuccessModel(remotefilePath)
}

module.exports = {
  handleAddTask,
  handleGetMyTask,
  handleUploadImg
}