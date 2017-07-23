'use strict';

const Router = require('koa-router');

const { isAdmin } = require('../middlewares/auth.js');
const Admin = require('../models/admin.js');
const Team = require('../models/team.js');

const router = module.exports = new Router();

router.get('/', isAdmin, async function (ctx) {
  ctx.state.round = await Admin.getRound(ctx.state.db);
  ctx.state.teams = await Team.selectTeams(ctx.state.db);
  await ctx.render('admin');
});

router.post('/round', isAdmin, async function (ctx) {
  try {
    await Admin.updateRound(ctx.state.db, ctx.request.body);
    ctx.redirect('/admin');
  } catch (error) {
    ctx.state = { error };
    await ctx.render('error');
  }
});
