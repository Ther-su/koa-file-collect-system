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
    },
    uploadImageFailInfo: {
        code: 10011,
        message: '上传图片失败'
    },
    uploadFileFailInfo: {
        code: 10012,
        message: '上传文件失败'
    },
    verifyUploadFailInfo: {
        code: 10013,
        message: '验证上传失败'
    },
    handleOverdueFailInfo: {
        code: 10014,
        message: '处理作业过期失败'
    },
    updateTaskFailInfo: {
        code: 10015,
        message: '更新作业失败'
    },
    deleteTaskFailInfo: {
        code: 10016,
        message: '删除作业失败'
    },
    getPublishedTaskFailInfo: {
        code: 10017,
        message: '获取发布的作业失败'
    },
    getNeedSubmitListFailInfo: {
        code: 10018,
        message: '获取需提交作业用户信息失败'
    },
    downloadTaskFailInfo: {
        code: 10019,
        message: '下载作业失败'
    },
}
