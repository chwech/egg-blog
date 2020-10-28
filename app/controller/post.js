"use strict"

const Controller = require("egg").Controller

class PostController extends Controller {
  async index() {
    const ctx = this.ctx

    ctx.logger.info('请求文章列表')
    const posts = await ctx.service.post.getList()
    const [{ total }] = await ctx.service.post.getCount()

    ctx.body = {
      code: 20000,
      data: {
        items: posts,
        total: total
      }
    }
  }
}

module.exports = PostController
