const {TaskRelation,Task} = require('../db/model')
const seq = require('../db/seq')

async function createTask({taskName, taskContent, deadline, canSubmitWhenOverdue,gradeId, checkedStudents, publishTime}) {
  const t = await seq.transaction();
  try {
    const result = await Task.create({
      taskName, 
      taskContent, 
      deadline, 
      canSubmitWhenOverdue,
      gradeId,
      publishTime
    },{transaction:t})
    const {dataValues} = result
    const userList = checkedStudents.map(item => {
      return {
        userId: item,
        taskId: dataValues.id
      }
    })
    await TaskRelation.bulkCreate(userList,{transaction:t})
    await t.commit()
    return dataValues
  } catch(error) {
    await t.rollback()
    throw new Error(error)
  }
}

async function getMyTask({userId, gradeId}) {
  try {
    const result = await TaskRelation.findAndCountAll({
      attributes:['id','status','submitTime',seq.col('task.taskName'),seq.col('task.taskContent'),seq.col('task.deadline'),seq.col('task.publishTime'),seq.col('task.canSubmitWhenOverdue')],
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
        taskId
      },
      raw: true
    })
    return result
  } catch(error) {
    throw new Error(error)
  }
}

module.exports = {
  createTask,
  getMyTask,
  getPicNum
}