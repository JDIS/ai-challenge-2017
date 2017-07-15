'use strict';

const Router = require('koa-router');

const Team = require('../models/team.js');

const router = module.exports = new Router();

router.get('/', async function (ctx) {
  /* ctx.state = { yup: 1337 };*/
  await ctx.render('register');
});

router.post('/', async function (ctx) {
  try {
    const team = await Team.createTeam(ctx.state.db, ctx.request.body);
    console.log(team);
    ctx.session = Team.setSession(ctx.session, team);
    ctx.redirect('/dashboard');
  } catch (error) {
    ctx.state = { error };
    await ctx.render('error');
  }
});
