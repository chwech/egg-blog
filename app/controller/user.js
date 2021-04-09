"use strict"

const Controller = require("egg").Controller

class UserController extends Controller {
  async login() {
    const ctx = this.ctx
    const { app } = this.ctx

    // 获取参数
    const body = ctx.request.body
    const username = body.username
    const password = body.password

    console.log(body)

    // 校验参数
    ctx.validate({
      username: { type: 'string', require: true },
      password: { type: 'string', require: true }
    })

    // 调用服务（service）
    const userInfo = await ctx.service.user.find(username)

    if (userInfo) {
      ctx.logger.info(userInfo.user_pass)

      // TODO: 密码要加密加盐
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
    const token = ctx.request.body.token
    ctx.logger.info(token)
    await ctx.service.user.revokedToken(token)

    ctx.body = {
      code: 20000,
      message: '退出登录成功'
    }
  }

  async info() {
    const ctx = this.ctx

    // ctx.state.user egg-jwt 从token中解析出的payload数据
    const userInfo = await ctx.service.user.find(ctx.state.user.username)

    this.ctx.body = {
      code: 20000,
      data: {
        roles: [userInfo.roles],
        introduction: userInfo.user_introduction,
        avatar: userInfo.user_url,
        name: userInfo.user_nicename
      }
    }
  }
}

module.exports = UserController
