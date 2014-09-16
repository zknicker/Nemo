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

    socket.on('message:post', function(data) {
        console.log("MESSAGE RECEIVED");
        MessageController.create(data, socket);
    });
}

function onSave(socket, doc, cb) {
  Message.populate(doc, {path:'author', select: 'name'}, function(err, message) {
      console.log("EMITTING MESSAGE");
    socket.emit('message:post', message);
  });
}

function onRemove(socket, doc, cb) {
  socket.emit('message:remove', doc);
}
