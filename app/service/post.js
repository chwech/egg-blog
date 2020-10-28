'use strict'

const Service = require('egg').Service

class PostService extends Service {
  async getList() {
    // eslint-disable-next-line max-len
    const posts = await this.app.mysql.select('wp_posts', {
      limit: 20
    })

    return posts
  }

  async getCount () {
    const count = await this.app.mysql.query('select count(*) as total from wp_posts')
    return count
  }
}

module.exports = PostService