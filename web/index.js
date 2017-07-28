'use strict';

require('dotenv').config();
if (!process.env.SECRET) {
  throw new Error('You need an .env file. Go read the web readme');
}

const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const http = require('http');
const https = require('https');
const app = new Koa();

app.use(require('koa-favicon')((`${__dirname}/resources/favicon.png`)));
app.use(require('koa-logger')());
app.use(require('koa-helmet')());
app.use(require('koa-compress')({
  flush: require('zlib').Z_SYNC_FLUSH
}));

app.keys = [process.env.SECRET];
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

var options = {
    key: fs.readFileSync(path.resolve(process.cwd(), 'server.key'), 'utf8').toString(),
    cert: fs.readFileSync(path.resolve(process.cwd(), 'server.crt'), 'utf8').toString(),
}

var port = process.env.PORT || 8080;
var sslport = process.env.SSLPORT || 8443;

var serverCallback = app.callback();

/********* HTTP server (redirect to HTTPS) *********/

var httpServer = http.createServer(function(req, res) {
  var host = req.headers['host'].split(':')[0];
  var url = req.url;
  var redirectUrl = "https://" + host + ":"+sslport + url
  res.writeHead(301,
      {"Location": redirectUrl})
  res.end()
});

httpServer.listen(port, function(err) {
    if (!!err) {
      console.error('HTTP server FAIL: ', err, (err && err.stack));
    }
    else {
      console.log(`HTTP server OK: ${port}`);
    }
});

/********* HTTPS server *********/

var httpsServer = https.createServer(options, serverCallback);

httpsServer.listen(sslport, function(err) {
    if (!!err) {
      console.error('HTTPS server FAIL: ', err, (err && err.stack));
    }
    else {
      console.log(`HTTPS server OK: ${sslport}`);
    }
});

module.exports = app;