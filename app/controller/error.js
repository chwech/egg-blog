"use strict"

const Controller = require('../core/base_controller')

class ErrorController extends Controller {
  async collect () {
    const ctx = this.ctx
    const body = ctx.request.body

    ctx.logger.info(body)
    const result = await ctx.service.error.add(body)
    
    this.success(result)
  }
}

module.exports = ErrorController
