const fse = require('fs-extra')

async function ifNotExistMkdirs(path) {
  if (!fse.existsSync(path)) {
    await fse.mkdirs(path)
  }
}
const extractExt = (filename) =>
  filename.slice(filename.lastIndexOf('.'), filename.length); // 提取后缀名

module.exports = {
  ifNotExistMkdirs,
  extractExt
}