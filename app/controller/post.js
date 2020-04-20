"use strict"

const Controller = require("egg").Controller

class PostController extends Controller {
  async index() {
    const ctx = this.ctx

    let posts = await ctx.service.post.getList()

    ctx.body = {
      code: 20000,
      data: {
        items: posts,
        total: 2
      }
    }
  }
}

module.exports = PostController
