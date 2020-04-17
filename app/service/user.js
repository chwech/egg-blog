'use strict'

const Service = require('egg').Service

class UserService extends Service {
  async find(username) {
    // eslint-disable-next-line max-len
    const user = await this.app.mysql.get('wp_users', { 'user_login': username })

    return user
  }


}

module.exports = UserService