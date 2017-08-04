'use strict';

const query = require('./query.js');

module.exports.getConfigs = async db => {
  return db.one(query.getConfigs);
}

module.exports.updateRound = async (db, request) => {
  if (request.round == null) {
    throw new Error('Missing round');
  }
  return db.none(query.updateRound, [request.round]);
}

module.exports.updateSubmitionsOver = async (db, request) => {
  if (request.isOver == null ||
    (request.isOver !== 'TRUE' && request.isOver !== 'FALSE')) {
    throw new Error('Missing isOver');
  }
  return db.none(query.updateSubmitionsOver, [request.isOver === 'TRUE']);
}
