'use strict'

const Service = require('egg').Service

class UserService extends Service {
  async find(uid) {
    // eslint-disable-next-line max-len
    const user = await this.app.mysql.query('select * from wp_users where id = 1', uid)

    return user
  }
}

module.exports = UserService