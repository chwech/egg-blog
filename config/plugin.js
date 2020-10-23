'use strict'

/** @type Egg.EggPlugin */
module.exports = {

  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  
  // 鉴权
  passport: {
    enable: true,
    package: 'egg-passport',
  },
  passportLocal: {
    enable: false,
    package: 'egg-passport-local',
  },

  jwt: {
    enable: true,
    package: "egg-jwt"
  },

  // 启用egg-mysql插件访问mysql数据库
  mysql: {
    enable: true,
    package: 'egg-mysql',
  },

  // 启用nunjucks模板引擎
  nunjucks: {
    enable: true,
    package: 'egg-view-nunjucks'
  },

  // 校验参数插件
  validate: {
    enable: true,
    package: 'egg-validate',
  },

  // 跨域处理
  cors: {
    enable: true,
    package: 'egg-cors',
  }
}
