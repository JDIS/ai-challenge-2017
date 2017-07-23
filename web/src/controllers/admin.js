'use strict';

const Router = require('koa-router');

const { isAdmin } = require('../middlewares/auth.js');
const Admin = require('../models/admin.js');

const router = module.exports = new Router();

router.get('/', isAdmin, async function (ctx) {
  ctx.state.round = await Admin.getRound(ctx.state.db);
  await ctx.render('admin');
});
