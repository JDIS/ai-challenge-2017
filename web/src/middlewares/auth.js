'use strict';

function isAuthBool (ctx) {
  if (ctx.session && ctx.session.id != null) {
    return true;
  } else {
    return false;
  }
}
async function isAuth (ctx, next) {
  if (isAuthBool(ctx)) {
    await next();
  } else {
    ctx.throw(401);
  }
}
module.exports.isAuth = isAuth;

async function isAdmin (ctx, next) {
  if (isAuthBool(ctx) && ctx.session.admin === true) {
    await next();
  } else {
    ctx.throw(401);
  }
}
module.exports.isAdmin = isAdmin;
