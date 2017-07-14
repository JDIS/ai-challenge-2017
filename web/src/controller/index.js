'use strict';

const Router = require('koa-router');

const router = module.exports = new Router();

const register = require('./register.js');
router.use('/register', register.routes(), register.allowedMethods());
