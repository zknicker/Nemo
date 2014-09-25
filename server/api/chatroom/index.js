'use strict';

var express = require('express');
var controller = require('./chatroom.controller');

var router = express.Router();

// Get list of chatrooms
router.get('/', controller.index);

// Gets the test alpha chatroom id
router.get('/alpha', controller.getTestRoom);

// Create chatroom
router.post('/:id', controller.create);

// Close chatroom
router.delete('/:id', controller.close);

// Add user to chatroom
router.post('/:id/users', controller.addUser);

// Remove user from chatroom
router.delete("/:id", controller.removeUser);

// Get users in chatroom
router.get('/:id/users', controller.getUsers);

// Get messages in chatrooms
router.patch('/:id/messages', controller.messages);

module.exports = router;
