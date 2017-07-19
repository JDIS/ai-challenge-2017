'use strict';

const Router = require('koa-router');

const { isAuth } = require('../middlewares/auth.js');
const Team = require('../models/team.js');
const Game = require('../models/game.js');

const router = module.exports = new Router();

router.get('/', isAuth, async function (ctx) {
  ctx.state.bots = await Team.selectBots(ctx.state.db);
  ctx.state.joinableGames =
    await Game.selectJoinableGames(ctx.state.db, ctx.session);
  await ctx.render('dashboard');
});
