'use strict';

const Router = require('koa-router');

const { isAuth } = require('../middlewares/auth.js');
const Team = require('../models/team.js');

const router = module.exports = new Router();

router.get('/', isAuth, async function (ctx) {
  ctx.state.bots = await Team.selectBots(ctx.state.db);
  console.log(ctx.state.bots);
  await ctx.render('dashboard');
});
