'use strict';

const Router = require('koa-router');
const multer = require('koa-multer');

const Team = require('../models/team.js');
const { isAuth, isNotOver } = require('../middlewares/auth.js');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './bots/');
  },
  filename: function (req, file, cb) {
    cb(null, `${req.session.id}.zip`);
  }
});
const upload = multer({ storage: storage })
const router = module.exports = new Router();

router.post('/bot', isAuth, isNotOver, async function (ctx) {
  ctx.req.session = ctx.session;
  await upload.single('file')(ctx);
  Team.sessionRedirect(ctx);
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

router.post('/session', async function (ctx) {
  try {
    const team = await Team.login(ctx.state.db, ctx.request.body);
    ctx.session = Team.setSession(ctx.session, team);
    Team.sessionRedirect(ctx);
  } catch (error) {
    ctx.state = { error };
    await ctx.render('error');
  }
});

router.get('/disconnect', async function (ctx) {
  ctx.session = null;
  ctx.redirect('/login');
});
