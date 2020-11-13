/**
 * @description res 的数据模型
 * @author 
 */

/**
 * 基础模块
 */
class BaseModel {
	constructor({code, data, message}) {
		this.code = code
		if (data) {
			this.data = data
		}
		if (message) {
			this.message = message
		}
	}
}

/**
 * 成功的数据模型
 */
class SuccessModel extends BaseModel {
	constructor(data = {}) {
		super({
			code: 0,
			data:data
		})
	}
}

/**
 * 失败的数据模型
 */
class ErrorModel extends BaseModel {
	constructor({ code, message }) {
		super({
			code,
			message
		})
	}
}

module.exports = {
    SuccessModel,
    ErrorModel
}
