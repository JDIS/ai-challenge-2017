'use strict';

const Router = require('koa-router');

const { isAdmin } = require('../middlewares/auth.js');
const Admin = require('../models/admin.js');
const Team = require('../models/team.js');
const Game = require('../models/game.js');
const moment = require('moment-timezone');

const router = module.exports = new Router();

router.get('/', isAdmin, async function (ctx) {
  ctx.state.teams = await Team.selectTeams(ctx.state.db);
  ctx.state.ranked = await Game.selectRankeds(ctx.state.db);

  // sort games by date (newest first)
  ctx.state.ranked.sort(sortGamesNewestFirst);

  // format data for the view
  ctx.state.ranked.forEach(formatGameData);

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

router.post('/is-over', isAdmin, async function (ctx) {
  try {
    await Admin.updateSubmitionsOver(ctx.state.db, ctx.request.body);
    ctx.redirect('/admin');
  } catch (error) {
    ctx.state = { error };
    await ctx.render('error');
  }
});

function formatGameData (game) {
  if (game.replay) {
    game.replay = encodeURIComponent(`/public/games/${game.replay}`);
  }
  moment.locale('fr-CA');
  game.created = moment(game.created).tz('America/New_York').format('HH:mm');

  switch (game.status) {
    case 'played':
      game.status = 'Partie complétée"'
      break;
    case 'created':
      game.status = 'Partie en attente"'
      break;
    default:
      break;
  }
}

function sortGamesNewestFirst (gameA, gameB) {
  return gameB.created - gameA.created;
}
