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

    // 参数校验
    ctx.validate({
      name: { type: 'string', required: true },
      slug: { type: 'string', required: true },
      parent: { type: 'number' }
    })
    const result = await ctx.service.category.add(body)

    this.success(result)
  }
}

module.exports = CategoryController
