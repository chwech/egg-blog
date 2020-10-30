"use strict"

const Controller = require("egg").Controller
const qiniu = require("qiniu")

class QiniuController extends Controller {
  constructor (ctx) {
    super(ctx)
    this.mac = this.getMac()
  }

  // 生成客户端上传所需要的上传凭证
  async getToken() {
    const ctx = this.ctx
    const uploadToken = await this.getSimpleToken()
    
    ctx.logger.info('请求七牛token', uploadToken)

    ctx.body = {
      code: 20000,
      data: {
        url: 'http://up-z2.qiniup.com',
        token: uploadToken
      }
    }
  }

  // 鉴权对象
  getMac () {
    const accessKey = '_V0UGMIRy_bOG5mG20ZXALwq8zcRt5sOObDzNwXg'
    const secretKey = 'xUU4q3HQ66eV9KyCqnhvxVUNMxJ-LMmKKN4qztT5'
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

    return mac
  }
  
  // 简单上传的凭证
  async getSimpleToken () {
    const options = {
      scope: 'www-chwech-com',
      expires: 1000
    }
    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken = putPolicy.uploadToken(this.mac)

    return uploadToken
  }
}

module.exports = QiniuController
