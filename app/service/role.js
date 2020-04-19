'use strict'

const Service = require('egg').Service

class RoleService extends Service {
  async getList() {
    const roles = await this.app.mysql.select('wp_roles')

    return roles
  }


}

module.exports = RoleService