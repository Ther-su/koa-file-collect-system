const {TaskSubmit, User} = require('../db/model')
const seq = require('../db/seq');

async function bulkCreateTaskSubmit (
  userList,
  {transaction}
) {
  await TaskSubmit.bulkCreate(userList,{transaction})
}

async function getOneTaskSubmit (
  {userId, taskId}
) {
  try {
    const res = await TaskSubmit.findOne({
      raw: true,
      where: {
        userId,
        taskId
      }
    })
    return res
  }catch(err) {
    throw new Error(err)
  }

}

async function getTaskSubmitRelationList({taskId}) {
  try {
    const result = await TaskSubmit.findAll({
      attributes:['taskId','status','submitTime','suffix',seq.col('user.id'),seq.col('user.userName'),seq.col('user.fullName'),seq.col('user.gender'),seq.col('user.studentNumber')],
      where: {
        taskId
      },
      raw: true,
      include: [
        {
          model:User,
          attributes: [],
          where: {
            '$user.id': seq.col('taskSubmit.userId')
          }
        }
      ],
    })
    return result
  } catch(error) {
    throw new Error(error)
  }
}

async function getTaskSubmitList({taskId}) {
  try {
    const result = await TaskSubmit.findAll({
      where: {
        taskId
      },
      raw: true,
    })
    return result
  } catch(error) {
    throw new Error(error)
  }
}

async function updateTaskSubmit({taskId, status, submitTime, userId,fileHash,suffix},{transaction}) {
  const updateTaskSubmitData = {}
  if (status) {
    updateTaskSubmitData.status = status
  }
  if (suffix) {
    updateTaskSubmitData.suffix = suffix
  }
  if (submitTime) {
    updateTaskSubmitData.submitTime = submitTime
  }
  if (fileHash) {
    updateTaskSubmitData.fileHash = fileHash
  }
  try {
    const res = await TaskSubmit.update(updateTaskSubmitData, {
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

async function deleteTaskSubmit({taskId, userId},{transaction}) {
  try {
    const whereData = {}
    if (taskId) whereData.taskId = taskId
    if (userId) whereData.userId = userId
    const res = await TaskSubmit.destroy({
      where:whereData
    },
      {transaction},
    )
    return res.dataValues
  } catch(error) {
    throw new Error(error)
  }
}

module.exports = {
  getTaskSubmitRelationList,
  getTaskSubmitList,
  updateTaskSubmit,
  bulkCreateTaskSubmit,
  deleteTaskSubmit,
  getOneTaskSubmit
}