"use strict"

const Controller = require("egg").Controller

class UserController extends Controller {
  async login() {
    const ctx = this.ctx
    const { app } = this.ctx
    const body = ctx.request.body

    ctx.logger.info(body)
    if (body.username === 'admin' && body.password === '111111') {
      ctx.logger.info('登录成功')
      const token = app.jwt.sign({ foo: 'bar' }, app.config.jwt.secret)

      ctx.body = {
        code: 20000,
        message: '登录成功',
        data: {
          token: token
        }
      }
    } else {
      ctx.body = {
        code: 40001,
        message: '账号或密码错误'
      }
    }
  }

  async logout() {
    const ctx = this.ctx

    ctx.logout()
    ctx.redirect(ctx.get("referer") || "/login")
  }

  async info() {
    this.ctx.body = {
      code: 20000,
      data: {
        roles: ['admin'],
        introduction: 'I am a super administrator',
        avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
        name: 'Super Admin'
      }
    }
  }
}

module.exports = UserController
