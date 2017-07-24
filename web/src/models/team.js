'use strict';

const bcrypt = require('bcrypt');
const xss = require('xss');

const query = require('./query.js');

const saltRounds = module.exports.saltRounds = 10;

async function insertTeam (db, name, members, password) {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const nbAdmin = (await db.one(query.countAdmin)).count;
    return await db.one(query.insertTeam, [name, members, nbAdmin === '0', hash]);
  } catch (error) {
    console.error(error);
    throw new Error(`Was not able to insert. ${error.detail || ''}`);
  }
}

async function createTeam (db, form) {
  const { name, members, password } = form;

  if (!name || !members || !password) {
    throw new Error('Missing fields');
  }

  if (name.length < 3) {
    throw new Error('Name must be equal or longer than 3 characters');
  }

  if (password.length < 5) {
    throw new Error('Password must be equal or longer than 5 characters');
  }

  return insertTeam(db, xss(name), xss(members), password);
}
module.exports.createTeam = createTeam;

function setSession (session, team) {
  const newSession = Object.assign({}, session);
  newSession.id = team.id;
  newSession.admin = team.admin;

  return newSession;
}
module.exports.setSession = setSession;

async function login (db, { name, password }) {
  try {
    const team = await db.one(query.selectTeam, [name]);

    if (team.bot === true) {
      throw new Error("Can't log with a bot");
    }

    if (!(await bcrypt.compare(password, team.password))) {
      throw new Error('Wrong password');
    }

    return { id: team.id, admin: team.admin };
  } catch (error) {
    console.error(error);
    throw new Error('Wrong credentials');
  }
}
module.exports.login = login;

function sessionRedirect (ctx) {
  if ((!ctx.session || ctx.session.isNew) && !ctx.session.id) {
    return false;
  }

  if (ctx.session.id != null && ctx.session.admin === true) {
    ctx.redirect('/admin');
  } else if (ctx.session.id != null) {
    ctx.redirect('/dashboard');
  }

  return true;
}
module.exports.sessionRedirect = sessionRedirect;

async function selectBots (db, session, request) {
  return db.many(query.selectBots);
}
module.exports.selectBots = selectBots;

module.exports.selectTeams = async db => {
  return db.many(query.selectTeams);
}
