const {TaskRelation,Task, User} = require('../db/model')
const seq = require('../db/seq');

async function createTask(
  {taskName, taskContent, deadline,gradeId, checkedStudents, publishTime},
  {transaction}
  ) {
  try {
    const result = await Task.create({
      taskName, 
      taskContent, 
      deadline, 
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

async function getMyTasks({userId, pageNum, pageSize}) {
  try {
    const result = await TaskRelation.findAndCountAll({
      attributes:['id','taskId','status','submitTime',seq.col('task.taskName'),seq.col('task.taskContent'),seq.col('task.deadline'),seq.col('task.publishTime')],
      where: {
        userId
      },
      limit: pageSize,
      offset: (pageNum - 1) * pageSize,
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

async function getSubmitSituation({taskId}) {
  try {
    const result = await TaskRelation.findAll({
      attributes:['id','taskId','status',seq.col('user.userName'),seq.col('user.fullName'),seq.col('user.gender'),seq.col('user.studentNumber')],
      where: {
        taskId
      },
      raw: true,
      include: [
        {
          model:User,
          attributes: [],
          where: {
            '$user.id': seq.col('taskRelation.userId')
          }
        }
      ],
    })
    return result
  } catch(error) {
    throw new Error(error)
  }
}

async function getPublishedTasks({gradeId, pageNum, pageSize}) {
  try {
    const result = await Task.findAndCountAll({
      where: {
        gradeId
      },
      limit: pageSize,
      offset: (pageNum - 1) * pageSize,
      raw: true,
      sort: ['publishTime', 'DESC'],
    })
    return result
  } catch(error) {
    throw new Error(error)
  }
}


async function updateTaskRelation({taskId, status, submitTime, userId,fileHash,suffix},{transaction}) {
  const updateTaskRelationData = {}
  if (status) {
    updateTaskRelationData.status = status
  }
  if (suffix) {
    updateTaskRelationData.suffix = suffix
  }
  if (submitTime) {
    updateTaskRelationData.submitTime = submitTime
  }
  if (fileHash) {
    updateTaskRelationData.fileHash = fileHash
  }
  try {
    const res = await TaskRelation.update(updateTaskRelationData, {
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
  getMyTasks,
  getPublishedTasks,
  updateTaskRelation,
  getSubmitSituation
}