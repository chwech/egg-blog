"use strict"

const Controller = require("egg").Controller

class UserController extends Controller {
  async login() {
    const ctx = this.ctx
    const { app } = this.ctx
    const body = ctx.request.body
    const username = body.username
    const password = body.password

    // 校验参数
    ctx.validate({
      username: { type: 'string', require: true },
      password: { type: 'string', require: true }
    })

    // 调用服务（service）
    const userInfo = await ctx.service.user.find(username)

    if (userInfo) {
      ctx.logger.info(userInfo.user_pass)

      // TODO: 密码要加密
      if (password === userInfo.user_pass) {
        ctx.logger.info('登录成功')
        const token = app.jwt.sign({ username: username }, app.config.jwt.secret)
  
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
          message: '密码错误'
        }
      }
    } else {
      ctx.body = {
        code: 40001,
        message: '该用户未注册'
      }
    }
  }

  async logout() {
    const ctx = this.ctx

    ctx.body = {
      code: 20000,
      message: '退出登录成功'
    }
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
