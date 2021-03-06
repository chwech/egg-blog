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

  async destroy() {
    const { id } = this.ctx.params

    if (parseInt(id) === 1) {

      // TODO: 自定义异常处理
      // throw new Error('未分类类别不能删除')
      this.fail(40001, '未分类类别不能删除！')
      return
    }
    const result = await this.ctx.service.category.delete(id)
  
    if (result.success) {
      this.success()
    } else {
      this.fail()
    }
  }
}

module.exports = CategoryController
