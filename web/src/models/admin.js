'use strict';

const query = require('./query.js');

module.exports.getRound = async db => {
  return (await db.one(query.getRound)).round;
}

module.exports.updateRound = async (db, request) => {
  if (request.round == null) {
    throw new Error('Missing round');
  }
  return db.none(query.updateRound, [request.round]);
}
