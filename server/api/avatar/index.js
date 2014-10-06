'use strict';

var express = require('express');
var controller = require('./avatar.controller');

var router = express.Router();

// Return an avatar.
router.get('/:filename', controller.getAvatar);


module.exports = router;
