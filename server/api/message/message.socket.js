/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Message = require('./message.model');
var MessageController = require('./message.controller');
var User = require('../user/user.model');

// Socket listeners to react to client messages.
exports.register = function(socketio, socket) {
    socket.on('message:post', function(data) {
        MessageController.create(data, socket);
    });
}

// Listeners to react to server changes by emitting those changes to clients.
exports.registerOnce = function(socketio) {
    Message.schema.post('save', function (doc) {
        console.log("doc SAVED.");
        onSave(socketio, doc);
    });

    Message.schema.post('remove', function (doc) {
        onRemove(socketio, doc);
    });
}

function onSave(socketio, doc, cb) {
    Message.populate(doc, {path:'author', select: 'name avatar avatarExtension'}, function(err, message) {
        socketio.sockets.emit('message:post', message);
    });
}

function onRemove(socketio, doc, cb) {
    socketio.sockets.emit('message:remove', doc);
}
