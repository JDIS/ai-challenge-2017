'use strict';

require('dotenv').config();
const Koa = require('koa');
const app = module.exports = new Koa();

//app.use(require('koa-favicon')(require.resolve('./public/favicon.ico')));
app.use(require('koa-logger')());
app.use(require('koa-helmet')());
app.use(require('koa-compress')({
    flush: require('zlib').Z_SYNC_FLUSH
}));
app.keys = [process.env.SECRET];
app.use(require('koa-session')(app));
app.use(require('koa-bodyparser')());

app.use(require('koa-views')(__dirname + '/src/views', {
  extension: 'hbs',
  map: { hbs: 'handlebars' }
}));

const controllers = require('./src/controllers');
app.use(controllers.routes())
   .use(controllers.allowedMethods());

const port = process.env.PORT || 8080;
app.listen(port);
console.log(`listening on port ${port}`);
