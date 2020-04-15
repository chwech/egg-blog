'use strict'

module.exports = () => {
  return async function auth (ctx, next) {
    ctx.logger.info('认证中间件运行')
    if (ctx.isAuthenticated()) {
      await next()
    } else {
      ctx.body = {
        status: 401,
        msg: '未认证'
      }
    }
  }
}
