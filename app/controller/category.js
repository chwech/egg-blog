"use strict"

const Controller = require('../core/base_controller')

class CategoryController extends Controller {
  async index() {
    const ctx = this.ctx

    ctx.logger.info('请求分类列表')
    const lists = await ctx.service.category.getList()

    this.success({
      items: lists
    })
  }

  async create() {
    const ctx = this.ctx
    const body = ctx.request.body

    const result = await ctx.service.category.add(body)

    this.success(result)
  }
}

module.exports = CategoryController
