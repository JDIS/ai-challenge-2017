const bcrypt = require('bcrypt');

const {
  createTeam,
  saltRounds,
  setSession,
} = require('./team.js');

test('createTeam missing fields', async () => {
  await expect(createTeam({}, {})).rejects.toEqual(new Error('Missing fields'));
  await expect(createTeam({}, {
    members: 'b',
    password: 'c',
  })).rejects.toEqual(new Error('Missing fields'));
  await expect(createTeam({}, {
    name: 'a',
    password: 'c',
  })).rejects.toEqual(new Error('Missing fields'));
  await expect(createTeam({}, {
    name: 'a',
    members: 'b',
  })).rejects.toEqual(new Error('Missing fields'));
  await expect(createTeam({}, {
    name: 'a',
  })).rejects.toEqual(new Error('Missing fields'));
  await expect(createTeam({}, {
    members: 'b',
  })).rejects.toEqual(new Error('Missing fields'));
  await expect(createTeam({}, {
    password: 'c',
  })).rejects.toEqual(new Error('Missing fields'));
});

test('createTeam field size', async () => {
  await expect(createTeam({}, {
    name: 'a',
    members: 'b',
    password: 'ccccc',
  })).rejects.toEqual(new Error('Name must be equal or longer than 3 characters'));
  await expect(createTeam({}, {
    name: 'aaa',
    members: 'b',
    password: 'c',
  })).rejects.toEqual(new Error('Password must be equal or longer than 5 characters'));
});

test('createTeam create admin', async () => {
  const successDB = {};
  successDB.one = jest.fn();
  successDB.one.mockReturnValueOnce(Promise.resolve({ count: '0' }));
  successDB.one.mockReturnValueOnce(Promise.resolve({ id: 1, admin: true }));

  await createTeam(successDB, {
    name: 'aaaaaa',
    members: 'b',
    password: 'cccccc',
  });

  expect(successDB.one.mock.calls[1][1][2]).toEqual(true);
});

test("createTeam don't create admin", async () => {
  const successDB = {};
  successDB.one = jest.fn();
  successDB.one.mockReturnValueOnce(Promise.resolve({ count: '1' }));
  successDB.one.mockReturnValueOnce(Promise.resolve({ id: 1, admin: false }));

  await createTeam(successDB, {
    name: 'aaaaaa',
    members: 'b',
    password: 'cccccc',
  });

  expect(successDB.one.mock.calls[1][1][2]).toEqual(false);
  const hash = successDB.one.mock.calls[1][1][3];
  expect(await bcrypt.compare('cccccc', hash)).toBeTruthy();
});

test("createTeam rejects when there's a DB error", async () => {
  const successDB = {};
  successDB.one = jest.fn();
  successDB.one.mockReturnValueOnce(Promise.resolve({ count: '1' }));
  successDB.one.mockReturnValueOnce(Promise.reject({ detail: 'yup' }));

  const result = createTeam(successDB, {
    name: 'aaaaaa',
    members: 'b',
    password: 'cccccc',
  });

  await expect(result).rejects.toEqual(new Error('Was not able to insert. yup'));
});

test('createTeam resolves to the created team', async () => {
  const successDB = {};
  successDB.one = jest.fn();
  successDB.one.mockReturnValueOnce(Promise.resolve({ count: '1' }));
  successDB.one.mockReturnValueOnce(Promise.resolve({ id: '42', admin: true }));

  const result = await createTeam(successDB, {
    name: 'aaaaaa',
    members: 'b',
    password: 'cccccc',
  });

  expect(result).toEqual({ id: '42', admin: true });
});

test("setSession returns a session with id and admin", async () => {
  expect(setSession({ id: 1, admin: true }, { id: 2, admin: false }))
    .toEqual({ id: 2, admin: false });
});
