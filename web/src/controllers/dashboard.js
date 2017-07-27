'use strict';

const Router = require('koa-router');

const { isAuth } = require('../middlewares/auth.js');
const Team = require('../models/team.js');
const Game = require('../models/game.js');
const moment = require('moment');

const router = module.exports = new Router();

router.get('/', isAuth, async function (ctx) {
  ctx.state.id = ctx.session.id;
  ctx.state.bots = await Team.selectBots(ctx.state.db);
  ctx.state.joinableGames =
    await Game.selectJoinableGames(ctx.state.db, ctx.session);
  ctx.state.relatedGames =
    await Game.selectRelatedGames(ctx.state.db, ctx.session);
  
  // sort games by date (newest first)
  ctx.state.relatedGames.sort(function(a,b){
    return b.updated - a.updated;
  });

  // format data for the view
  ctx.state.relatedGames.forEach(function(a){
    if(a.replay){
      a.replay = encodeURIComponent("/public/games/"+a.replay);
    }
    moment.locale("fr-CA");
    a.updated = moment(a.updated).format('LLL');

    switch(a.status) {
        case "played":
            a.status = "Partie complétée"
            break;
        case "created":
            a.status = "Partie en attente"
            break;
        default:
            break;
    }
  });


  await ctx.render('dashboard');
});
