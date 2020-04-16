'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  app.router.get('/', app.jwt, app.controller.home.index)

  // 登录校验
  app.router.post('/user/login', app.controller.user.login)
  app.router.get('/user/logout', app.controller.user.logout)

  app.router.get('/user/info', app.jwt, app.controller.user.info)
}
