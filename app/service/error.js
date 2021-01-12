'use strict'

const Service = require('egg').Service

class ErrorService extends Service {
  async add(data) {
    // eslint-disable-next-line max-len
    const result = await this.app.mysql.insert('wp_errors', { 
      info: data.info,
      name: data.name,
      message: data.message,
      stack: data.stack,
      // eslint-disable-next-line camelcase
      line_number: data.lineNumber,
      // eslint-disable-next-line camelcase
      column_number: data.columnNumber,
      filename: data.filename
    })

    return result
  }
}

module.exports = ErrorService