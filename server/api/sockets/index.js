'use strict';

var express = require('express');
var controller = require('./sockets.controller');

var router = express.Router();

router.get('/', controller.getSocketsForDefaultNameSpace);

module.exports = router;