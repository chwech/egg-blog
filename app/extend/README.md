可以通过定义 app/extend/{application,context,request,response}.js 来扩展 Koa 中对应的四个对象的原型

例如：
``` javascript
// app/extend/context.js
module.exports = {
  get isIOS() {
    const iosReg = /iphone|ipad|ipod/i;
    return iosReg.test(this.get('user-agent'));
  },
};
```

在controller就可以调用这个方法了

``` javascript
// app/controller/home.js
exports.handler = ctx => {
  ctx.body = ctx.isIOS
    ? 'Your operating system is iOS.'
    : 'Your operating system is not iOS.';
};
```