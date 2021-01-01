const {TaskRelation,Task} = require('../db/model')
const seq = require('../db/seq');
const { uploadImageFailInfo } = require('../model/ErrorInfo');

async function createTask(
  {taskName, taskContent, deadline, canSubmitWhenOverdue,gradeId, checkedStudents, publishTime},
  {transaction}
  ) {
  try {
    const result = await Task.create({
      taskName, 
      taskContent, 
      deadline, 
      canSubmitWhenOverdue,
      gradeId,
      publishTime
    },{transaction})
    const {dataValues} = result
    const userList = checkedStudents.map(item => {
      return {
        userId: item,
        taskId: dataValues.id
      }
    })
    await TaskRelation.bulkCreate(userList,{transaction})
    return dataValues
  } catch(error) {
    throw new Error(error)
  }
}

async function getMyTask({userId}) {
  try {
    const result = await TaskRelation.findAndCountAll({
      attributes:['id','taskId','status','submitTime',seq.col('task.taskName'),seq.col('task.taskContent'),seq.col('task.deadline'),seq.col('task.picNum'),seq.col('task.publishTime'),seq.col('task.canSubmitWhenOverdue')],
      where: {
        userId
      },
      raw: true,
      sort: ['publishTime', 'DESC'],
      include: [
        {
          model:Task,
          attributes: [],
          where: {
            '$task.id': seq.col('taskRelation.taskId')
          }
        }
      ],
    })
    return result
  } catch(error) {
    throw new Error(error)
  }
}

async function getPicNum({taskId}) {
  try {
    const result = await Task.findOne({
      where: {
        id:taskId
      },
      raw: true
    })
    return result
  } catch(error) {
    throw new Error(error)
  }
}

async function addPicNum({
  taskId
},{transaction}) {
  await Task.increment('picNum',{
    where:{
      id: taskId
    }
  },{transaction})
}

async function updateTaskStatus({taskId, status, submitTime, userId,fileHash},{transaction}) {
  const updateTaskStatusData = {}
  if (status) {
    updateTaskStatusData.status = status
  }
  if (submitTime) {
    updateTaskStatusData.submitTime = submitTime
  }
  if (fileHash) {
    updateTaskStatusData.fileHash = fileHash
  }
  try {
    const res = await TaskRelation.update(updateTaskStatusData, {
      where: {
        userId,
        taskId
      }
    },
      {transaction},
    )
    return res.dataValues
  } catch(error) {
    throw new Error(error)
  }
}

module.exports = {
  createTask,
  getMyTask,
  updateTaskStatus,
  getPicNum,
  addPicNum
}