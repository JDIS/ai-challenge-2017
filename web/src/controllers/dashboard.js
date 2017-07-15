'use strict';

const Router = require('koa-router');

const { isAuth } = require('../middlewares/auth.js');

const router = module.exports = new Router();

router.get('/', isAuth, async function (ctx) {
  console.log(ctx);
  await ctx.render('dashboard');
});
