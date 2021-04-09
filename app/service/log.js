'use strict'

const Service = require('egg').Service

class LogService extends Service {
  async save(log) {
    await this.app.mysql.insert('wp_logs', log)
  }
}

module.exports = LogService
