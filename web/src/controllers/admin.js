'use strict';

const Router = require('koa-router');

const { isAdmin } = require('../middlewares/auth.js');

const router = module.exports = new Router();

router.get('/', isAdmin, async function (ctx) {
  await ctx.render('admin');
});
