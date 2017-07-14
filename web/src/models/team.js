'use strict';

const bcrypt = require('bcrypt');

const query = require('./query.js');

const saltRounds = module.exports.saltRounds = 10;

async function insertTeam(db, name, members, password) {
  try {
    const nbAdmin = (await db.one(query.countAdmin)).count;
    await db.none(query.insertTeam, [name, members, nbAdmin === '0', password]);
  } catch (error) {
    console.error(error);
    throw new Error('Was not able to insert');
  }
}

async function createTeam(db, form) {
  const { name, members, password } = form;

  if (!name || !members || !password) {
    throw new Error('Missing fields');
  }

  if (name.length < 3 || password.length < 5) {
    throw new Error("Fields length");
  }

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  await insertTeam(db, name, members, password);
}
module.exports.createTeam = createTeam;

function setSession(session, team) {

}
module.exports.setSession = setSession;
