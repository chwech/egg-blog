"use strict"

const Controller = require("egg").Controller

class HomeController extends Controller {
  async index() {
    const ctx = this.ctx

    await ctx.render('index.html')
  }

  async login() {
    const ctx = this.ctx

    ctx.logger.info('登录成功')

    // await ctx.render('login.html')
  }

  async admin() {
    const { ctx } = this

    console.log(ctx.isAuthenticated())
    if (ctx.isAuthenticated()) {

      // show user info
    } else {

      // redirect to origin url by ctx.session.returnTo
      ctx.session.returnTo = ctx.path
      await ctx.render("login.html")
    }
  }

  async logout() {
    const ctx = this.ctx

    ctx.logout()
    ctx.redirect(ctx.get("referer") || "/login")
  }
}

module.exports = HomeController
