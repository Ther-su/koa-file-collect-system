const {Grade} = require('../db/model')
async function createGrade({
  school,
  major,
  gradeName,
  peopleNum
},{transaction}) {
  const result = await Grade.create({
    school,
    major,
    gradeName,
    peopleNum
  },{transaction})
  const data = result.dataValues
  return data
}

async function updatePeopleNum({
  gradeId
},{transaction}) {
  await Grade.increment('peopleNum',{
    where:{
      id: gradeId
    }
  },{transaction})
}


async function updateGrade({
  gradeName,
  major,
  school
},gradeId,{transaction}) {
  await Grade.update({
    gradeName,
    major,
    school
  },{
    where:{
      id: gradeId
    }
  },{transaction})
}

module.exports = {
  createGrade,
  updatePeopleNum,
  updateGrade
}