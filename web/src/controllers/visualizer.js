'use strict';

const Router = require('koa-router');

const { isNotOver } = require('../middlewares/auth.js');

const router = module.exports = new Router();

router.get('/', isNotOver, async function (ctx) {
  await ctx.render('visualizer');
});
