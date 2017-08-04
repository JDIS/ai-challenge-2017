'use strict';

if (!process.env.WEB_SECRET) {
  throw new Error('You need an .env file. Go read the readme');
}

const Koa = require('koa');
const app = module.exports = new Koa();

app.use(require('koa-favicon')((`${__dirname}/resources/favicon.png`)));
app.use(require('koa-logger')());
app.use(require('koa-helmet')());
app.use(require('koa-compress')({
  flush: require('zlib').Z_SYNC_FLUSH
}));

app.keys = [process.env.WEB_SECRET];
app.use(require('koa-session')(app));
app.use(require('koa-bodyparser')());

app.use(require('koa-views')(`${__dirname}/src/views`, {
  extension: 'hbs',
  map: { hbs: 'handlebars' },
  options: {
    partials: {
      start: 'start',
      end: 'end',
    },
  }
}));
app.use(require('./src/middlewares').manage401);
app.use(require('./src/middlewares').addHelpers);
app.use(require('./src/middlewares').manageConnection);
app.use(require('./src/middlewares').manageConfigs);

const controllers = require('./src/controllers');
app.use(controllers.routes())
  .use(controllers.allowedMethods());

const serveList = require('koa-serve-list');
const serveStatic = require('koa-serve-static');
const mount = require('koa-mount');
app.use(mount('/public', (ctx, next) =>
  serveList('public')(ctx, next)
    .catch(() => serveStatic('public')(ctx, next))
    .catch(e => console.error(e))));

app.listen(8080);
console.log('listening on port 8080');
