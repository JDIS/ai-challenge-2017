'use strict';

const Router = require('koa-router');

const router = module.exports = new Router();

router.get('/', async function (ctx) {
  console.log(ctx);
  await ctx.render('dashboard');
});
