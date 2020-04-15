'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  app.router.get('/', app.controller.home.index)
  app.router.get('/admin', 'home.admin')
  
  app.router.get('/login', 'home.login')

  // 登录校验
  app.router.post('/login', app.passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/' 
  }))
}
