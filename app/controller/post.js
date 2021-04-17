"use strict"

const Controller = require('../core/base_controller')

class PostController extends Controller {
  async index() {
    const ctx = this.ctx
    const body = ctx.request.query

    // 参数校验
    ctx.validate({
      currentPage: { type: 'string', required: true },
      pageSize: { type: 'string', required: true },
      category: { type: 'string', required: true},
      isTrash: { type: 'string', required: true}
    }, ctx.request.query)

    ctx.logger.info('请求文章列表')
    const posts = await ctx.service.post.getList(body)

    // const [{ total }] = await ctx.service.post.getCount()

    this.success(
      {
        items: posts,

        // total: total
      }
    )
  }
  async bypostname() {
    const ctx = this.ctx
    const body = ctx.request.query

    // 参数校验
    ctx.validate({
      postName: { type: 'string', required: true },
    }, ctx.request.query)

    ctx.logger.info('请求文章列表')
    const posts = await ctx.service.post.getListByPostName(body)

    // const [{ total }] = await ctx.service.post.getCount()

    this.success(
      {
        items: posts,

        // total: total
      }
    )
  }
  async add() {
    const ctx = this.ctx
    const body = ctx.request.body

    // 参数校验
    ctx.validate({
      title: { type: 'string', required: true },
      content: { type: 'string', required: true },
      status: { type: 'string', required: true },
      auth: { type: 'number', required: true },
      postName: { type: 'string', required: true },
      tag: { type: 'string', required: false },
      category: { type: 'string', required: false },
    })

    ctx.logger.info('添加文章')
    const result = await ctx.service.post.addPost(body)

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
      title: { type: 'string', required: true },
      content: { type: 'string', required: true },
      status: { type: 'string', required: true },
      postName: { type: 'string', required: true },
      tag: { type: 'string', required: false },
      category: { type: 'string', required: true },
    })

    ctx.logger.info('更新文章')
    const result = await ctx.service.post.updatePost(body)

    if(result.statu) {
      this.success(result.data)
    } else {
      this.fail(result.data)
    }
  }

  async trash() {
    const ctx = this.ctx
    const body = ctx.request.body

    // 参数校验
    ctx.validate({
      id: { type: 'number', required: true },
      isTrash: { type: 'number', required: true }
    })
    
    ctx.logger.info('文章移入移出回收站')
    const result = await ctx.service.post.trashPost(body)

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
      id: { type: 'number', required: true },
    })

    ctx.logger.info('删除文章')
    const result = await ctx.service.post.deletePost(body)

    if(result.statu) {
      this.success(result.data)
    } else {
      this.fail(result.data)
    }
  }
}

module.exports = PostController
