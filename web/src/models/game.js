'use strict';

const query = require('./query.js');

async function createGame (db, session, request, ranked = false) {
  // It's a flatten
  const bots = [...(request.team || [])];
  await db.none(query.insertGame, [
    ranked,
    bots.length + 1,
    session.id,
    bots[0] || null,
    bots[1] || null,
    bots[2] || null,
  ]);
}
module.exports.createGame = createGame;

async function joinGame (db, session, request) {
}
module.exports.joinGame = joinGame;
