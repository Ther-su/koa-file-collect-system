const { ErrorModel } = require('../model/ResModel')
const { roleCheckFailInfo } = require('../model/ErrorInfo')

/**
 * API 登录验证
 * @param {Object} ctx ctx
 * @param {function} next next
 */
async function adminCheck(ctx, next) {
  
    if (ctx.session.userInfo && ctx.session.userInfo.role == 'admin') {
      await next()
      return
    }
    ctx.body = new ErrorModel(roleCheckFailInfo)
}

module.exports = {
  adminCheck
}