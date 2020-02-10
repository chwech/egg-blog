'use strict'

/** @type Egg.EggPlugin */
module.exports = {

  // had enabled by egg
  // static: {
  //   enable: true,
  // }
  passport: {
    enable: true,
    package: 'egg-passport',
  },
  passportLocal: {
    enable: true,
    package: 'egg-passport-local',
  },

  mysql: {
    enable: true,
    package: 'egg-mysql',
  }
}
