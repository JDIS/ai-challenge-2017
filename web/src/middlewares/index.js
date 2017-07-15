'use strict';

const pgp = require('pg-promise')({});
const cn = {
  host: 'localhost',
  port: 5432,
  database: 'jdis',
  user: 'jdis',
  password: 'compeIA'
};

const db = pgp(cn);

async function addHelpers(ctx, next) {
  if (!ctx.state) {
    ctx.state = {};
  }

  ctx.state.db = db;

  await next();
}
module.exports.addHelpers = addHelpers;

async function manageConnection(ctx, next) {
  /* let currentTeam = null;
   * if(ctx.session.teamId){
   *   currentUser = await models.User.findById(ctx.session.userId);
   * }*/
  /* ctx.state.currentUser = currentUser;*/
  /* ctx.state.isUserSignIn = (currentUser != null);*/
  await next();
}
module.exports.manageConnection = manageConnection;

async function manage401 (ctx, next) {
  try {
    await next();
  } catch(error) {
    if (error.status !== 401) {
      throw error;
    }

    ctx.session = null;
    ctx.redirect('/login');
  }
}

module.exports.manage401 = manage401;
