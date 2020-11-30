/**
 * @description 失败信息集合，包括 code 和 message
 * @author 双越老师
 */

module.exports = {
    // 用户名已存在
    registerUserNameExistInfo: {
        code: 10001,
        message: '用户名已存在'
    },
    // 获取用户信息失败
    getInfoFailInfo: {
        code: 10002,
        message: '获取用户信息失败，请重试'
    },
    // 用户名不存在
    registerUserNameNotExistInfo: {
        code: 10003,
        message: '用户名未存在'
    },
    // 登录失败
    loginFailInfo: {
        code: 10004,
        message: '登录失败，用户名或密码错误'
    },
    // 未登录
    loginCheckFailInfo: {
        code: 10005,
        message: '您尚未登录或登录凭证已过期'
    },
    // 修改密码失败
    changePasswordFailInfo: {
        code: 10006,
        message: '修改密码失败，请重试'
    },
    getGradePeopleFailInfo: {
        code: 10007,
        message: '获取班级用户列表失败'
    },
    roleCheckFailInfo: {
        code: 10008,
        message: '您没有该项操作的权限'
    },
    publishTaskFailInfo: {
        code: 10009,
        mesage: '发布新作业失败'
    },
    getMyTaskFailInfo: {
        code: 10010,
        message: '获取我的作业失败'
    }
}
