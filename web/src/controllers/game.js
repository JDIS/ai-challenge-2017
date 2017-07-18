'use strict';

const Router = require('koa-router');

const { isAuth } = require('../middlewares/auth.js');
const Team = require('../models/team.js');
const Game = require('../models/game.js');

const router = module.exports = new Router();

router.post('/', isAuth, async function (ctx) {
  Game.createGame(ctx.state.db, ctx.session, ctx.request.body);
  Team.sessionRedirect(ctx);
});
