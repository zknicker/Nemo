/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Message = require('./message.model');
var MessageController = require('./message.controller');
var User = require('../user/user.model');

exports.register = function(socket) {
    Message.schema.post('save', function (doc) {
        onSave(socket, doc);
    });

    Message.schema.post('remove', function (doc) {
        onRemove(socket, doc);
    });

    socket.on('message:save', function(data) {
        MessageController.create(data, socket);
      console.log("Message sent by: " + socket.user.name);
    });
}

function onSave(socket, doc, cb) {
  Message.populate(doc, {path:'author', select: 'name'}, function(err, message) {
    socket.emit('message:save', message);
  });
}

function onRemove(socket, doc, cb) {
  socket.emit('message:remove', doc);
}
