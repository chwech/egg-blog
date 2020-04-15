'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const auth = app.middleware.auth()

  app.router.get('/', auth, app.controller.home.index)
  app.router.get('/admin', 'home.admin')
  
  app.router.get('/login', 'home.login')
  app.router.get('/logout', 'home.logout')


  // 登录校验
  app.router.post('/login', app.passport.authenticate('local', {
    failureRedirect: '/login',
    successRedirect: '/' 
  }))
}
