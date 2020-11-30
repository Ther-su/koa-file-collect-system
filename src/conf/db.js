const { isProd } = require('../utils/env')
let MYSQL_CONF = {
  host: 'localhost',
  user: 'root',
  password: 'SU20000922',
  port: '3306',
  database: 'file_collect'
}
let REDIS_CONF = {
  port: 6379,
  host: '127.0.0.1'
}
if (isProd) {
  REDIS_CONF = {
    // 线上的 redis 配置
    port: 6379,
    host: '127.0.0.1'
  }

  MYSQL_CONF = {
    // 线上的 mysql 配置
    host: 'localhost',
    user: 'root',
    password: 'SU20000922',
    port: '3306',
    database: 'file_collect'
  }
  
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF
}