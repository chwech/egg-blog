
// 我们常常需要在应用启动期间进行一些初始化工作，等初始化完成后应用才可以启动成功，并开始对外提供服务。
// 框架提供了统一的入口文件（app.js）进行启动过程自定义，这个文件返回一个 Boot 类，
// 我们可以通过定义 Boot 类中的生命周期方法来执行启动应用过程中的初始化工作。
'use strict'
const LocalStrategy = require('passport-local').Strategy

function initPassport(app) {
  app.passport.use(new LocalStrategy({
    passReqToCallback: true,
  }, (req, username, password, done) => {

    // format user
    const user = {
      provider: 'local',
      username,
      password,
    }

    app.passport.doVerify(req, user, done)
  }))

  // 处理用户信息

  // 校验用户
  // eslint-disable-next-line no-unused-vars
  app.passport.verify(async (ctx, user) => {
    ctx.logger.info('校验用户', user)

    return user
  })
  
  // 序列化用户信息后存储进 session
  // eslint-disable-next-line no-unused-vars
  app.passport.serializeUser(async (ctx, user) => {
    ctx.logger.info('序列化用户信息后存进session', user)
    return user
  })
  
  // 反序列化后取出用户信息
  // eslint-disable-next-line no-unused-vars
  app.passport.deserializeUser(async (ctx, user) => {
    ctx.logger.info('反序列化后取出用户信息', user)
    user.me = 'chwech'

    return user
  })
}

class AppBootHook {

  constructor(app) {
    this.app = app
  }

  async didLoad() {

    // 请将你的插件项目中 app.beforeStart 中的代码置于此处。
  }

  async willReady() {

    // 请将你的应用项目中 app.beforeStart 中的代码置于此处。
    
    // 所有的插件都已启动完毕，但是应用整体还未 ready
    // 可以做一些数据初始化等操作，这些操作成功才会启动应用

    // 挂载 strategy
    // initPassport(this.app)
  }
}

module.exports = AppBootHook