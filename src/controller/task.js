const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { createTask, getMyTasks, updateTaskRelation, getPublishedTasks, getSubmitSituation } = require('../services/task')
const { publishTaskFailInfo , uploadImageFailInfo, uploadFileFailInfo} = require('../model/ErrorInfo')
const {doCrypto,deCryptId,enCryptId} = require('../utils/cryp')
const { isProd } = require('../utils/env')
const { ifNotExistMkdirs, extractExt } = require('../utils/file')
const fse = require('fs-extra')
const path = require('path')
const seq = require('../db/seq')
const { existsSync } = require('fs-extra')
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


const pipeStream = (path, writeStream) =>
  new Promise((resolve) => {
    const readStream = fse.createReadStream(path);
    readStream.on('end', () => {
      fse.unlinkSync(path);
      resolve();
    });
    readStream.pipe(writeStream);
  });

async function handleAddTask(ctx, { taskName, taskContent, deadline, checkedStudents, publishTime }) {
  let t = null
  try {
    t = await seq.transaction();
    const res = await createTask({
      taskName, taskContent, deadline,checkedStudents, publishTime, gradeId: deCryptId(ctx.session.userInfo.gradeId)},
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

async function handleGetPublishedTask (ctx,{gradeId, pageNum, pageSize}) {
  try {
    const res = await getPublishedTasks({gradeId: deCryptId(gradeId), pageNum: parseInt(pageNum), pageSize:parseInt(pageSize)})
    return new SuccessModel({taskList:res.rows,count:res.count})
  }catch (e) {
    console.error(e.message, e.stack)
    return new ErrorModel(publishTaskFailInfo)
  }
}

async function handleGetMyTask (ctx,{userId, pageNum, pageSize}) {
  let t = null
  try {
    t = await seq.transaction()
    const res = await getMyTasks({userId, pageNum: parseInt(pageNum), pageSize:parseInt(pageSize)})
    const taskList = await Promise.all(
      res.rows.map(async item => {
        const status = item.status
        const deadline = item.deadline
        if (status != '3' && Date.now() > new Date(deadline).getTime()) {
          await updateTaskRelation({taskId:item.taskId,status:3,userId},{transaction:t})
        } 
        return item
      })
    )
    await t.commit()
    return new SuccessModel({taskList,count:res.count})
  }catch (e) {
    await t.rollback()
    console.error(e.message, e.stack)
    return new ErrorModel(publishTaskFailInfo)
  }
}

async function handleGetSubmitSituation (ctx,{taskId}) {
  try {
    const res = await getSubmitSituation({taskId})
    return new SuccessModel({submitSituation:res})
  }catch (e) {
    console.error(e.message, e.stack)
    return new ErrorModel(publishTaskFailInfo)
  }
}

async function handleUploadImg (ctx, { hash }) {
  try {
    ifNotExistMkdirs(UPLOAD_IMAGE_DIR)
    const {file} = ctx.request.files 
    const ext = extractExt(file.name);
    let filePath = `${UPLOAD_IMAGE_DIR}/${hash}${ext}`
    let remotefilePath = `${GET_IMAGE_DIR}/${hash}${ext}`
    pipeStream(
      file.path,
      fse.createWriteStream(filePath)
    )
    return new SuccessModel({url:remotefilePath})
  } catch(ex) {
    console.error(ex.message, ex.stack)
    return new ErrorModel(uploadImageFailInfo)
  }
}

async function handleVerifyUpload (ctx,{ hash, fileName }) {
  try {
    const ext = extractExt(fileName)
    const filePath = path.resolve(UPLOAD_FILE_DIR,`${hash}${ext}`)
    if (fse,existsSync(filePath)) {
      return new SuccessModel({presence:true})
    }else {
      return new SuccessModel({presence:false})
    }
  } catch (ex) {
    console.error(ex.message, ex.stack)
    return new ErrorModel(uploadImageFailInfo)
  }
}

async function handleFileChunk (ctx, { taskId, chunkId, fileHash }) {
  try {
    const {file} = ctx.request.files 
    const reader = fse.createReadStream(file.path);
    const FILE_PATH = path.resolve(UPLOAD_FILE_DIR,fileHash)
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
    const filePath = path.resolve(UPLOAD_FILE_DIR,`${fileHash}${ext}`)
    const chunkDir = path.resolve(UPLOAD_FILE_DIR, fileHash);
    const chunkPaths = await fse.readdir(chunkDir)
    chunkPaths.sort((a,b) => Number(a) - Number(b))
    await Promise.all(
      chunkPaths.map((chunkPath, index) => 
        // new Promise((resolve) => {
        //   const readerPath = path.resolve(chunkDir,chunkPath)
        //   const reader = fse.createReadStream(readerPath)
        //   const upStream = fse.createWriteStream(filePath, {
        //     start: index * 10 * 1024 * 1024,
        //   })
        //   reader.on('end', () => {
        //     fse.unlinkSync(readerPath)
        //     resolve()
        //   })
        //   reader.pipe(upStream)
        // })
        pipeStream(
          path.resolve(chunkDir, chunkPath),
          fse.createWriteStream(filePath, {
            start: index * 10 * 1024 *1024
          })
        )
      )
    )
    const res = await updateTaskRelation({taskId,status:2,submitTime,userId:ctx.session.userInfo.id,fileHash,suffix:ext},{transaction:t})
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
    const res = await updateTaskRelation({taskId,status:3,userId:ctx.session.userInfo.id},{transaction:t})
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
  handleTaskOverdue,
  handleGetPublishedTask,
  handleVerifyUpload,
  handleGetSubmitSituation
}