const bcrypt = require('bcrypt');

const {
  createTeam,
  saltRounds,
} = require('./team.js');

test('createTeam missing fields', async () => {
  expect(createTeam({}, {})).rejects.toEqual(new Error('Missing fields'));
  expect(createTeam({}, {
    members: 'b',
    password: 'c',
  })).rejects.toEqual(new Error('Missing fields'));
  expect(createTeam({}, {
    name: 'a',
    password: 'c',
  })).rejects.toEqual(new Error('Missing fields'));
  expect(createTeam({}, {
    name: 'a',
    members: 'b',
  })).rejects.toEqual(new Error('Missing fields'));
  expect(createTeam({}, {
    name: 'a',
  })).rejects.toEqual(new Error('Missing fields'));
  expect(createTeam({}, {
    members: 'b',
  })).rejects.toEqual(new Error('Missing fields'));
  expect(createTeam({}, {
    password: 'c',
  })).rejects.toEqual(new Error('Missing fields'));
});

test('createTeam field size', async () => {
  expect(createTeam({}, {
    name: 'a',
    members: 'b',
    password: 'ccccc',
  })).rejects.toEqual(new Error('Name must be equal or longer than 3 characters'));
  expect(createTeam({}, {
    name: 'aaa',
    members: 'b',
    password: 'c',
  })).rejects.toEqual(new Error('Password must be equal or longer than 5 characters'));
});

test('createTeam create admin', async () => {
  const successDB = {};
  successDB.one = jest.fn();
  successDB.one.mockReturnValueOnce(Promise.resolve({count: '0'}));
  successDB.none = jest.fn();
  successDB.none.mockReturnValueOnce(Promise.resolve());

  await createTeam(successDB, {
    name: 'aaaaaa',
    members: 'b',
    password: 'cccccc',
  });

  expect(successDB.none.mock.calls[0][1][2]).toEqual(true);
});

test("createTeam don't create admin", async () => {
  const successDB = {};
  successDB.one = jest.fn();
  successDB.one.mockReturnValueOnce(Promise.resolve({count: '1'}));
  successDB.none = jest.fn();
  successDB.none.mockReturnValueOnce(Promise.resolve());

  await createTeam(successDB, {
    name: 'aaaaaa',
    members: 'b',
    password: 'cccccc',
  });

  expect(successDB.none.mock.calls[0][1][2]).toEqual(false);
  const hash = successDB.none.mock.calls[0][1][3];
  expect(await bcrypt.compare('cccccc', hash)).toBeTruthy();
});
