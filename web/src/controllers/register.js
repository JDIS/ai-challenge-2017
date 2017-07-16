'use strict';

const Router = require('koa-router');

const Team = require('../models/team.js');

const router = module.exports = new Router();

router.get('/', async function (ctx) {
  if (!Team.sessionRedirect(ctx)) {
    await ctx.render('register');
  }
});

router.post('/', async function (ctx) {
  try {
    const team = await Team.createTeam(ctx.state.db, ctx.request.body);
    ctx.session = Team.setSession(ctx.session, team);
    Team.sessionRedirect(ctx);
  } catch (error) {
    ctx.state = { error };
    await ctx.render('error');
  }
});
