var koa = require('koa');
var cors = require('koa-cors');
var app = koa();

var router = require('koa-router')();

router.get('/', function *(next) {
  this.body = {a: 1}
});

app
  .use(cors())
  .use(router.routes());

app.listen(3000);
console.log('Server started.');
