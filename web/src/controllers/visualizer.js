'use strict';

const Router = require('koa-router');

const router = module.exports = new Router();

router.get('/', async function (ctx) {
  if(ctx.session.admin){
    await ctx.render('visualizer');
  }
  else{
    await ctx.render('finale');
  }
});