'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  app.router.get('/', app.jwt, app.controller.home.index)

  // 登录校验
  app.router.post('/user/login', app.controller.user.login)
  app.router.post('/user/logout', app.controller.user.logout)

  // 获取用户信息
  app.router.get('/user/info', app.jwt, app.controller.user.info)

  // 文章
  app.router.resources('post', '/post', app.controller.post)

  // 角色
  app.router.resources('role', '/role', app.controller.role)
}
