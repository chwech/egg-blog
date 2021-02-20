'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  app.router.get('/', app.jwt, app.controller.home.index)

  // 登录校验
  app.router.post('/user/login', app.controller.user.login)
  app.router.post('/user/logout', app.controller.user.logout)

  // 七牛
  app.router.get('/qiniu/token', app.jwt, app.controller.qiniu.getToken)
  app.router.post('/qiniu/delete', app.jwt, app.controller.qiniu.delete)



  // 获取用户信息
  app.router.get('/user/info', app.jwt, app.controller.user.info)

  // 文章
  // app.router.resources('post', '/post', app.controller.post)
  app.router.get('/post', app.controller.post.index)
  app.router.post('/post/add', app.controller.post.add)
  app.router.post('/post/update', app.controller.post.update)
  app.router.post('/post/trash', app.controller.post.trash)
  app.router.post('/post/delete', app.controller.post.delete)


  // 分类管理
  app.router.resources('category', '/category', app.jwt, app.controller.category)
  app.router.post('/category/update', app.controller.category.update)
  app.router.post('/category/delete', app.controller.category.destroy)
  app.router.post('/category/getpost', app.controller.category.getpost)

  // 角色
  app.router.resources('role', '/role', app.controller.role)

  // 分类目录管理
  app.router.get('/slug', app.controller.slug.index)
  app.router.post('/slug/add', app.controller.slug.add)
  app.router.post('/slug/update', app.controller.slug.update)
  app.router.post('/slug/delete', app.controller.slug.delete)
  app.router.post('/slug/getcategory', app.controller.slug.getcategory)
  app.router.post('/slug/getpost', app.controller.slug.getpost)

  // 错误收集
  app.router.post('/collect_error', app.controller.error.collect)
}
