"use strict"

const Controller = require("egg").Controller

class LogController extends Controller {
  async saveLog() {
    const ctx = this.ctx
    const body = ctx.request.body

    ctx.logger.info('请求日志接口', body)
    await ctx.service.log.save(body)

    ctx.body = {
      code: 200,
      data: body,
      message: '保存成功'
    }
  }
}

module.exports = LogController
