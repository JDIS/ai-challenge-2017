const query = require('./query.js');
const {
  createGame,
} = require('./game.js');

test('createGame', async () => {
  const db = { none: jest.fn() };
  const session = { id: '1' };
  createGame(db, session, {});
  expect(db.none).toBeCalledWith(query.insertGame,
    [false, 1, '1', null, null, null]);

  db.none = jest.fn();
  createGame(db, session, { team: '2' });
  expect(db.none).toBeCalledWith(query.insertGame,
    [false, 2, '1', '2', null, null]);

  db.none = jest.fn();
  createGame(db, session, { team: ['2', '3'] });
  expect(db.none).toBeCalledWith(query.insertGame,
    [false, 3, '1', '2', '3', null]);

  db.none = jest.fn();
  createGame(db, session, { team: ['2', '3', '4'] });
  expect(db.none).toBeCalledWith(query.insertGame,
    [false, 4, '1', '2', '3', '4']);

  db.none = jest.fn();
  createGame(db, session, {}, true);
  expect(db.none).toBeCalledWith(query.insertGame,
    [true, 1, '1', null, null, null]);
});
