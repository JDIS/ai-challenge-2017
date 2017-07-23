'use strict';

const query = require('./query.js');

module.exports.getRound = async function getRound (db) {
  return (await db.one(query.getRound)).round;
}
