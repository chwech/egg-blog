"use strict"

const Controller = require("egg").Controller

class CategoryController extends Controller {
  async index() {
    const ctx = this.ctx

    ctx.logger.info('请求分类列表')
    const posts = await ctx.service.category.getList()

    ctx.body = {
      code: 20000,
      data: {
        items: posts
      }
    }
  }
}

module.exports = CategoryController
