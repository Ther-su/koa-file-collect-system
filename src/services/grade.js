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



async function updateGrade({
  gradeName,
  major,
  school,
  gradeId
},{transaction}) {
  const updateGradeData = {}
  if (gradeName) {
    updateGradeData.gradeName = gradeName
  }
  if (school) {
    updateGradeData.school = school
  }
  if (major) {
    updateGradeData.major = major
  }
  await Grade.update(updateGradeData,{
    where:{
      id: gradeId
    }
  },{transaction})
}

module.exports = {
  createGrade,
  updateGrade
}