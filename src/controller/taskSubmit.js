const path = require('path')
const fse = require('fs-extra')
const { getOneTaskSubmit } = require('../services/taskSubmit')
const { SuccessModel, ErrorModel } = require('../model/ResModel')
const { 
  downloadTaskFailInfo
} = require('../model/ErrorInfo')
const DOWNLOAD_DIR = path.resolve(__dirname, '..', 'public')
const DOWNLOAD_FILE_DIR = path.resolve(DOWNLOAD_DIR, 'taskSubmit')

async function handleDownloadOneTask (ctx,{taskId, userId}) {
  try {
    const {suffix, fileHash} = await getOneTaskSubmit({taskId, userId})
    const fileName = `${fileHash}${suffix}`
    return fse.createReadStream(path.resolve(DOWNLOAD_FILE_DIR,fileName))
  }catch (e) {
    console.error(e.message, e.stack)
    return new ErrorModel(downloadTaskFailInfo)
  }
}
module.exports = {
  handleDownloadOneTask
}