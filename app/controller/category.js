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
      description: { type: 'string', required: false },
      parent: { type: 'number', required: false },
      img: { type: 'string', required: false }
    })
    const result = await ctx.service.category.add(body)

    if(result.statu) {
      this.success(result.data)
    } else {
      this.fail(result.data)
    }
  }

  async update() {
    const ctx = this.ctx
    const body = ctx.request.body

    // 参数校验
    ctx.validate({
      id: { type: 'number', required: true },
      name: { type: 'string', required: true },
      slug: { type: 'string', required: true },
      description: { type: 'string', required: false },
      parent: { type: 'number', required: false },
      img: { type: 'string', required: false }
    })
    const result = await ctx.service.category.update(body)

    if(result.statu) {
      this.success(result.data)
    } else {
      this.fail(result.data)
    }
  }

  async destroy() {
    const ctx = this.ctx
    const body = ctx.request.body

    // 参数校验

    ctx.validate({
      id: { type: 'number', required: true },
    })
    if (parseInt(ctx.request.body.id) === 1) {

      // TODO: 自定义异常处理
      // throw new Error('未分类类别不能删除')
      this.fail({}, '未分类类别不能删除！', 40001)
      return
    }
    const result = await this.ctx.service.category.delete(body)
  
    if (result.statu) {
      this.success(result)
    } else {
      this.fail(result)
    }
  }

  async getpost() {
    const ctx = this.ctx
    const body = ctx.request.body

    // 参数校验

    ctx.validate({
      id: { type: 'string', required: true },
    })
    const result = await this.ctx.service.category.getPost(body)
  
    if (result.statu) {
      this.success(result)
    } else {
      this.fail(result)
    }
  }
}

module.exports = CategoryController
