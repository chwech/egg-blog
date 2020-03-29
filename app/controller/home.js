"use strict"

const Controller = require("egg").Controller

class HomeController extends Controller {
  async index() {
    const ctx = this.ctx

    // console.log(this.app.config.env)


    const userInfo = await ctx.service.user.find()
    
    ctx.body = userInfo

    // await ctx.render('index.html')
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
    ctx.redirect(ctx.get("referer") || "/")
  }
}

module.exports = HomeController
