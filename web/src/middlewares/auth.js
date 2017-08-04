'use strict';

function isAuthBool (ctx) {
  return ctx.session && ctx.session.id != null;
}

function isAdminBool (ctx) {
  return isAuthBool(ctx) && ctx.session.admin === true;
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
  if (isAdminBool(ctx)) {
    await next();
  } else {
    ctx.throw(401);
  }
}
module.exports.isAdmin = isAdmin;

module.exports.isNotOver = async (ctx, next) => {
  if (ctx.state.configs.submitions_over && !isAdminBool(ctx)) {
    await ctx.render('finale');
  } else {
    await next();
  }
}
