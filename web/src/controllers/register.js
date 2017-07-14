'use strict';

const Router = require('koa-router');

const router = module.exports = new Router();

router.get('/', async function (ctx) {
  /* ctx.state = { yup: 1337 };*/
  await ctx.render('register');
});
