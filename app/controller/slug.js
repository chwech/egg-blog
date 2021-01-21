"use strict"

const Controller = require('../core/base_controller')

class SlugController extends Controller {
  async index() {
    const ctx = this.ctx

    ctx.logger.info('请求分类目录')
    const lists = await ctx.service.slug.getList()

    this.success({
      items: lists
    })
  }

  async add() {
    const ctx = this.ctx
    const body = ctx.request.body

    // 参数校验
    ctx.validate({
      name: { type: 'string', required: true },
      slug: { type: 'string', required: true },
    })

    ctx.logger.info('添加分类目录')
    const result = await ctx.service.slug.add(body)

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
      id: { type: 'string', requred: true },
      name: { type: 'string', required: true },
      slug: { type: 'string', required: true },
    })

    ctx.logger.info('更新分类目录')
    const result = await ctx.service.slug.update(body)

    if(result.statu) {
      this.success(result.data)
    } else {
      this.fail(result.data)
    }
  }

  async delete() {
    const ctx = this.ctx
    const body = ctx.request.body

    // 参数校验
    ctx.validate({
      id: { type: 'string', requred: true }
    })

    ctx.logger.info('删除分类目录')
    const result = await ctx.service.slug.delete(body)

    if(result.statu) {
      this.success(result.data)
    } else {
      this.fail(result.data)
    }
  }

  async getcategory() {
    const ctx = this.ctx
    const body = ctx.request.body

    // 参数校验
    ctx.validate({
      slug: { type: 'string', requred: true }
    })
    ctx.logger.info('获取slug下分类目录')
    const result = await ctx.service.slug.getCategory(body)

    if(result.statu) {
      this.success(result.data)
    } else {
      this.fail(result.data)
    }
  }

  async getpost() {
    const ctx = this.ctx
    const body = ctx.request.body

    // 参数校验
    ctx.validate({
      slug: { type: 'string', requred: true }
    })
    ctx.logger.info('获取slug下文章')
    const result = await ctx.service.slug.getPost(body)

    if(result.statu) {
      this.success(result.data)
    } else {
      this.fail(result.data)
    }
  }
}

module.exports = SlugController
