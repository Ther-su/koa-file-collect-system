const {TaskSubmit,Task, User} = require('../db/model')
const seq = require('../db/seq');

async function deleteTask(
  {taskId},
  {transaction}
  ) {
  try {
    const result = await Task.destroy({
      where: {
        id: taskId
      }
    },{transaction})
    const {dataValues} = result
    return dataValues
  } catch(error) {
    throw new Error(error)
  }
}

async function createTask(
  {taskName, taskContent, deadline,gradeId, publishTime},
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
    return dataValues
  } catch(error) {
    throw new Error(error)
  }
}


async function updateTask(
  {taskName, taskContent, deadline, taskId},
  {transaction}
  ) {
  const updateTaskData = {}
  if (taskName) {
    updateTaskData.taskName = taskName
  }
  if (taskContent) {
    updateTaskData.taskContent = taskContent
  }
  if (deadline) {
    updateTaskData.deadline = deadline
  }

  try {
    const result = await Task.update(updateTaskData,{
      where: {
        id: taskId
      }
    },{transaction})
    const {dataValues} = result
    return dataValues
  } catch(error) {
    throw new Error(error)
  }
}

async function getMyTasks({userId, pageNum, pageSize}) {
  try {
    const result = await TaskSubmit.findAndCountAll({
      attributes:['id','taskId','status','submitTime',seq.col('task.taskName'),seq.col('task.taskContent'),seq.col('task.deadline'),seq.col('task.publishTime')],
      where: {
        userId
      },
      limit: pageSize,
      offset: (pageNum - 1) * pageSize,
      raw: true,
      include: [
        {
          model:Task,
          attributes: [],
          where: {
            '$task.id': seq.col('taskSubmit.taskId')
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
    })
    return result
  } catch(error) {
    throw new Error(error)
  }
}



module.exports = {
  createTask,
  getMyTasks,
  getPublishedTasks,
  updateTask,
  deleteTask
}