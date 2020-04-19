"use strict"

const Controller = require("egg").Controller

class RoleController extends Controller {
  async index() {
    const ctx = this.ctx

    let roles = await ctx.service.role.getList()

    ctx.body = {
      code: 20000,
      data: roles
    }
  }
}

module.exports = RoleController
