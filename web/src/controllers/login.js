'use strict';

const Router = require('koa-router');

const Team = require('../models/team.js');

const router = module.exports = new Router();

router.get('/', async function (ctx) {
  if (!Team.sessionRedirect(ctx)) {
    await ctx.render('login');
  }
});
