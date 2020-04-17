'use strict'

const Service = require('egg').Service

class PostService extends Service {
  async getList() {
    // eslint-disable-next-line max-len
    const posts = await this.app.mysql.select('wp_posts', {
      limit: 2
    })

    return posts
  }
}

module.exports = PostService