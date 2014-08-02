'use strict';

var express = require('express');
var controller = require('./message.controller');
var access = require('../../components/access/access');

var router = express.Router();

router.get('/', controller.index);
router.get('/:id', controller.show);
router.post('/', access.isAuthenticated, controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
