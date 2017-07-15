const {
  isAdmin,
  isAuth,
} = require('./auth.js');

function getPromiseSpy (resolve = true, data = undefined) {
  const spy = jest.fn();
  if (resolve) {
    spy.mockReturnValueOnce(Promise.resolve(data));
  } else {
    spy.mockReturnValueOnce(Promise.reject(data));
  }
  return spy;
}

test('isAuth', () => {
  const spy0 = getPromiseSpy();
  isAuth({ session: { id: 1, admin: true } }, spy0);
  expect(spy0).toBeCalled();

  const spy1 = getPromiseSpy();
  isAuth({ session: { id: 1, admin: false } }, spy1);
  expect(spy1).toBeCalled();

  const spy2 = getPromiseSpy();
  isAuth({ session: { admin: true }, throw: spy2 });
  expect(spy2).toBeCalledWith(401);

  const spy3 = getPromiseSpy();
  isAuth({ session: { id: 1 } }, spy3);
  expect(spy3).toBeCalled();

  const spy4 = getPromiseSpy();
  isAuth({ throw: spy4 });
  expect(spy4).toBeCalledWith(401);
});

test('isAdmin', () => {
  const spy0 = getPromiseSpy();
  isAdmin({ session: { id: 1, admin: true } }, spy0);
  expect(spy0).toBeCalled();

  const spy1 = getPromiseSpy();
  isAdmin({ session: { id: 1, admin: false }, throw: spy1 });
  expect(spy1).toBeCalledWith(401);

  const spy2 = getPromiseSpy();
  isAdmin({ session: { admin: true }, throw: spy2 });
  expect(spy2).toBeCalledWith(401);

  const spy3 = getPromiseSpy();
  isAdmin({ session: { id: 1 }, throw: spy3 });
  expect(spy3).toBeCalledWith(401);

  const spy4 = getPromiseSpy();
  isAdmin({ throw: spy4 });
  expect(spy4).toBeCalledWith(401);
});
