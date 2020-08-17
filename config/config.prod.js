'use strict'

// 生产环境配置
exports.mysql = {

  // 单数据库信息配置
  client: {

    // host
    host: 'mysql',

    // 端口号
    port: '3306',

    // 用户名
    user: 'root',

    // 密码
    password: 'admin_chwech',

    // 数据库名
    database: 'wordpress',
  },

  // 是否加载到 app 上，默认开启
  app: true,

  // 是否加载到 agent 上，默认关闭
  agent: false,
}