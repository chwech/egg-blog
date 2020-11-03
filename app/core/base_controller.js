'use strict'

// app/core/base_controller.js
const { Controller } = require('egg')

// 基类
class BaseController extends Controller {

  success(data, message = '操作成功') {
    this.ctx.body = {
      code: 20000,
      data,
      message: message
    }
  }

  fail (code = 40000, message = '操作失败', data) {
    this.ctx.body = {
      code: code,
      data,
      message: message
    }
  }
}
module.exports = BaseController