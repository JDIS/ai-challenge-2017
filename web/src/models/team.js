'use strict';

const bcrypt = require('bcrypt');

const query = require('./query.js');

const saltRounds = module.exports.saltRounds = 10;

async function insertTeam (db, name, members, password) {
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    const nbAdmin = (await db.one(query.countAdmin)).count;
    return (await db.one(query.insertTeam, [name, members, nbAdmin === '0', hash])).id;
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

  return await insertTeam(db, name, members, password);
}
module.exports.createTeam = createTeam;

function setSession (session, team) {

}
module.exports.setSession = setSession;
