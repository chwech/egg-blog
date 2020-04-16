'use strict'

// eslint-disable-next-line valid-jsdoc
/**
 * @param {Egg.EggAppInfo} appInfo app info
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
  config.middleware = []

  // add your user config here
  const userConfig = {

    // myAppName: 'egg',
  }

  // 配置模板引擎
  config.view = {
    mapping: { 
      '.html': 'nunjucks' // 指定 .html 后缀的文件使用 Nunjucks 进行渲染。
    }
  }

  
  config.security = {
    csrf: false // 开发时关闭，上线请打开
  }

  return {
    ...config,
    ...userConfig,
  }
}
