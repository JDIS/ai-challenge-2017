'use strict';

const Router = require('koa-router');
const multer = require('koa-multer');

const Team = require('../models/team.js');
const { isAuth } = require('../middlewares/auth.js');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../bots/');
  },
  filename: function (req, file, cb) {
    cb(null, `${req.session.id}.zip`);
  }
});
const upload = multer({ storage: storage })
const router = module.exports = new Router();

router.post('/bot', isAuth, async function (ctx) {
  ctx.req.session = ctx.session;
  await upload.single('file')(ctx);
  console.log(ctx.req.file);
  Team.sessionRedirect(ctx);
});
