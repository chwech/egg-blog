"use strict"

const Controller = require("egg").Controller

class UserController extends Controller {
  async login() {
    const ctx = this.ctx
    const body = ctx.request.body

    ctx.logger.info(body)
    if (body.username === 'admin' && body.password === '111111') {
      ctx.logger.info('登录成功')
      ctx.body = {
        code: 20000,
        message: '登录成功',
        data: {
          token: '123'
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
}

module.exports = UserController
