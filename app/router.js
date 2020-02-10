'use strict'

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  app.router.get('/', 'home.index')
  app.router.get('/admin', 'home.admin')

  const localStrategy = app.passport.authenticate('local')

  app.router.post('/passport/local', localStrategy)
}
