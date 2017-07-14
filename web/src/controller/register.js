'use strict';

const Router = require('koa-router');

const router = module.exports = new Router();

router.get('/', function (ctx, next) {
  ctx.body = '42';
});
