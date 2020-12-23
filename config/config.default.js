'use strict'

// eslint-disable-next-line valid-jsdoc
/**
 * @param {Egg.EggAppInfo} appInfo app info
 * 所有环境会加载这个配置文件
 */
module.exports = appInfo => {

  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = `${appInfo.name  }_1580804031302_7562`

  // add your middleware config here
  // 中间件
  config.middleware = [

  ]

  // add your user config here
  const userConfig = {

    // 七牛
    qiniu: {
      bucket: "www-chwech-com", // 空间名
      expires: 1000, // 过期时间
      aKey: '_V0UGMIRy_bOG5mG20ZXALwq8zcRt5sOObDzNwXg',
      sKey: 'xUU4q3HQ66eV9KyCqnhvxVUNMxJ-LMmKKN4qztT5'
    }
    
  }

  // 配置模板引擎
  config.view = {
    mapping: { 
      '.html': 'nunjucks' // 指定 .html 后缀的文件使用 Nunjucks 进行渲染。
    }
  }

  
  config.security = {
    csrf: false, // 开发时关闭，上线请打开
    domainWhiteList: [ 
      'http://localhost:9527', 
      'http://www.chwech.com:3001',
      'http://hm.huishimed.com',
      'http://localhost:8080',
      'http://localhost:8081'
    ],
  }

  config.jwt = {
    secret: "chwech-egg-blog-jwt-secret" // 密钥，对jwt header和payload部分签名用
  }

  return {
    ...config,
    ...userConfig,
  }
}
