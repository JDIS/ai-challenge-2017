'use strict';

const query = require('./query.js');

async function createGame (db, session, request) {
  await db.none(query.insertSimpleGame, [false, session.id]);
}
module.exports.createGame = createGame;

async function joinGame (db, session, request) {
}
module.exports.joinGame = joinGame;
