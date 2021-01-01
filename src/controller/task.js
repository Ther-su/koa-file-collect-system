const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { createTask, getMyTask, getPicNum, addPicNum, updateTaskStatus } = require('../services/task')
const { publishTaskFailInfo , uploadImageFailInfo, uploadFileFailInfo} = require('../model/ErrorInfo')
const {doCrypto,deCryptId,enCryptId} = require('../utils/cryp')
const { isProd } = require('../utils/env')
const { ifNotExistMkdirs, extractExt } = require('../utils/file')
const fse = require('fs-extra')
const path = require('path')
const seq = require('../db/seq')
const UPLOAD_DIR = path.resolve(__dirname, '..', 'public')
let GET_DIR = 'http://localhost:3000'
if(isProd) {
  GET_DIR = 'http://www.shenque.top'
}
const GET_IMAGE_DIR = GET_DIR + '/taskImage'
const UPLOAD_IMAGE_DIR = path.resolve(UPLOAD_DIR, 'taskImage')
const UPLOAD_FILE_DIR = path.resolve(UPLOAD_DIR, 'taskSubmit')
ifNotExistMkdirs(UPLOAD_DIR)
ifNotExistMkdirs(UPLOAD_FILE_DIR)

async function handleAddTask(ctx, { taskName, taskContent, deadline, checkedStudents, canSubmitWhenOverdue, publishTime }) {
  let t = null
  try {
    t = await seq.transaction();
    const res = await createTask({
      taskName, taskContent, deadline, canSubmitWhenOverdue,checkedStudents, publishTime, gradeId: deCryptId(ctx.session.userInfo.gradeId)},
      {transaction:t}
      )
    await t.commit()
    return new SuccessModel(res)
  }catch (e) {
    await t.rollback()
    console.error(e.message, e.stack)
    return new ErrorModel(publishTaskFailInfo)
  }
}

async function handleGetMyTask (ctx,{userId,gradeId}) {
  try {
    const res = await getMyTask({userId})
    const IMAGE_PATH = GET_IMAGE_DIR+'/'+gradeId
    let taskList=null
    Promise.all(
      res.rows.map(async item => {
        console.log('item', item)
        const picNum = item.picNum
        const status = item.status
        const deadline = item.deadline
        if (status != '3'&&Date.now() > new Date(deadline).getTime()) {
          await updateTaskStatus({taskId:item.taskId,status:3,userId},{transaction:t})
        }  
        const picList = []
        for(let i=1;i<=picNum;i++) {
          picList.push(`${IMAGE_PATH}/${item.taskId}-${i}.jpg`)
        }
        item.picList = picList
        return item
      })
    )
    .then(res=>{
      taskList=res
      console.log(taskList)
    return new SuccessModel(taskList)
    })
  }catch (e) {
    console.error(e.message, e.stack)
    return new ErrorModel(publishTaskFailInfo)
  }
}

async function handleUploadImg (ctx, { taskId }) {
  let t = null
  let filePath
  try {
    t = await seq.transaction();
    let remotefilePath = null;
    ifNotExistMkdirs(UPLOAD_IMAGE_DIR)
    const {file} = ctx.request.files 
    const reader = fse.createReadStream(file.path);
    const IMAGE_PATH = path.resolve(UPLOAD_IMAGE_DIR,taskId)
    ifNotExistMkdirs(IMAGE_PATH)
    const {picNum} = await getPicNum({ taskId })
    filePath = `${IMAGE_PATH}/${picNum+1}.jpg`;
    remotefilePath = `${GET_IMAGE_DIR}/${taskId}/${picNum+1}.jpg`;
    // 创建可写流
    const upStream = fse.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream)
    await addPicNum({taskId}, {transaction:t})
    await t.commit()
    return new SuccessModel(remotefilePath)
  } catch(ex) {
    await t.rollback()
    console.error(ex.message, ex.stack)
    if (filePath) {
      await fse.removeSync(filePath)
    }
    return new ErrorModel(uploadImageFailInfo)
  }
}
async function handleFileChunk (ctx, { taskId, chunkId, fileHash }) {
  try {
    const {file} = ctx.request.files 
    const reader = fse.createReadStream(file.path);
    const TASK_FILE_PATH = path.resolve(UPLOAD_FILE_DIR,taskId)
    ifNotExistMkdirs(TASK_FILE_PATH)
    const FILE_PATH = path.resolve(TASK_FILE_PATH,fileHash)
    ifNotExistMkdirs(FILE_PATH)
    const filePath = `${FILE_PATH}/${chunkId}`
    // 创建可写流
    const upStream = fse.createWriteStream(filePath);
    // 可读流通过管道写入可写流
    reader.pipe(upStream)
    return new SuccessModel()
  } catch(ex) {
    console.error(ex.message, ex.stack)
    return new ErrorModel(uploadFileFailInfo)
  }
}

async function handleFileMerge (ctx, { fileHash, fileName, taskId, submitTime }) {
  let t = null
  try {
    t = await seq.transaction()
    const ext = extractExt(fileName);
    const TASK_FILE_PATH = path.resolve(UPLOAD_FILE_DIR, `${taskId}`)
    ifNotExistMkdirs(TASK_FILE_PATH)
    const filePath = path.resolve(TASK_FILE_PATH,`${fileHash}${ext}`)
    const chunkDir = path.resolve(TASK_FILE_PATH, fileHash);
    const chunkPaths = await fse.readdir(chunkDir)
    chunkPaths.sort((a,b) => Number(a) - Number(b))
    await Promise.all(
      chunkPaths.map((chunkPath, index) => 
        new Promise((resolve) => {
          const readerPath = path.resolve(chunkDir,chunkPath)
          const reader = fse.createReadStream(readerPath)
          const upStream = fse.createWriteStream(filePath, {
            start: index * 10 * 1024 * 1024,
          })
          reader.on('end', () => {
            fse.unlinkSync(readerPath)
            resolve()
          })
          reader.pipe(upStream)
        })
      )
    )
    const res = await updateTaskStatus({taskId,status:2,submitTime,userId:ctx.session.userInfo.id,fileHash},{transaction:t})
    fse.rmdirSync(chunkDir)
    await t.commit()
    return new SuccessModel(res)
  }catch(ex) {
    await t.rollback()
    console.error(ex.message, ex.stack)
    return new ErrorModel(uploadFileFailInfo)
  }
}

async function handleTaskOverdue (ctx,{taskId}) {
  let t = null
  try {
    t = await transaction()
    const res = await updateTaskStatus({taskId,status:3,userId:ctx.session.userInfo.id},{transaction:t})
    await t.commit()
    return new SuccessModel(res)
  }catch (e) {
    await t.rollback()
    console.error(e.message, e.stack)
    return new ErrorModel(uploadFileFailInfo)
  }
}

module.exports = {
  handleFileChunk,
  handleAddTask,
  handleGetMyTask,
  handleUploadImg,
  handleFileMerge,
  handleTaskOverdue
}