"use strict"
const Controller = require('../core/base_controller')
const qiniu = require("qiniu")

class QiniuController extends Controller {
  constructor (ctx) {
    super(ctx)
    this.init()
  }
  
  init () {
    this.mac = this._getMac()
    this.bucket = this.config.qiniu.bucket
  }

  // 生成客户端上传所需要的上传凭证
  async getToken() {
    const ctx = this.ctx
    const uploadToken = this._getSimpleToken()
    
    ctx.logger.info('请求七牛token', uploadToken)

    this.success({
      url: 'http://up-z2.qiniup.com',
      token: uploadToken
    })
  }

  // 删除空间中的资源
  async delete() {
    const ctx = this.ctx
    const body = ctx.request.body

    ctx.logger.info('请求删除资源')
    const key = body.key

    try {
      const { respBody, respInfo } = await this._deleteFile(key)

      if (respInfo.statusCode === 200) {
        this.success(respBody)
      }
    } catch (error) {
      this.logger.error(new Error(error))
      this.fail(error)
    }

  }

  _deleteFile (key) {
    return new Promise((resolve, reject) => {
      const bucketManager = this._getBucketManager()

      bucketManager.delete(this.bucket, key, (err, respBody, respInfo) => {
        if (err) {
          this.logger.error(new Error(err))
          reject(err)
        } else {
          this.logger.info('删除成功', respInfo.statusCode, respBody)
          resolve({respBody, respInfo})
        }
      })
    })
  }

  _getBucketManager () {
    const config = new qiniu.conf.Config()

    config.zone = qiniu.zone.Zone_z2 // 华南
    return new qiniu.rs.BucketManager(this.mac, config)
  }

  // 鉴权对象
  _getMac () {
    const accessKey = this.config.qiniu.aKey
    const secretKey = this.config.qiniu.sKey
    const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

    return mac
  }
  
  // 简单上传的凭证
  _getSimpleToken () {
    const options = {
      scope: this.bucket,
      expires: this.config.qiniu.expires
    }
    const putPolicy = new qiniu.rs.PutPolicy(options)
    const uploadToken = putPolicy.uploadToken(this.mac)

    return uploadToken
  }
}

module.exports = QiniuController
