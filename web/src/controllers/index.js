'use strict';

const Router = require('koa-router');

const router = module.exports = new Router();

const register = require('./register.js');
router.use('/register', register.routes(), register.allowedMethods());
const login = require('./login.js');
router.use('/login', login.routes(), login.allowedMethods());
const dashboard = require('./dashboard.js');
router.use('/dashboard', dashboard.routes(), dashboard.allowedMethods());
const admin = require('./admin.js');
router.use('/admin', admin.routes(), admin.allowedMethods());
const game = require('./game.js');
router.use('/game', game.routes(), game.allowedMethods());
const team = require('./team.js');
router.use('/team', team.routes(), team.allowedMethods());
