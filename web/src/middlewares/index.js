'use strict';

const pgp = require('pg-promise')({});
const cn = {
  host: 'database',
  port: 5432,
  database: process.env.POSTGRES_USER,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
};

const Admin = require('../models/admin.js');

const db = pgp(cn);

async function addHelpers(ctx, next) {
  if (!ctx.state) {
    ctx.state = {};
  }

  if (ctx.session.isNew) {
    ctx.state.session = null;
  } else {
    ctx.state.session = ctx.session;
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

module.exports.manageConfigs = async (ctx, next) => {
  ctx.state.configs = await Admin.getConfigs(ctx.state.db);

  await next();
};

async function manage401 (ctx, next) {
  try {
    await next();
  } catch (error) {
    if (error.status !== 401) {
      throw error;
    }

    ctx.session = null;
    ctx.redirect('/login');
  }
}

module.exports.manage401 = manage401;
