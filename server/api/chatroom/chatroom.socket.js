/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Chatroom = require('./chatroom.model');
var ChatroomController = require('./chatroom.controller');
var UserActions = require('../user/user.actions');

exports.register = function(socketio, socket) {

    socket.on('chatroom:join', function(data) {
        ChatroomController.addUser(data.roomId, socket.user, function() {
            socket.emit('room:joined', {});
            socketio.sockets.emit('userlist:add', socket.user);
        });
        UserActions.joinRoom(socket, data.roomId, socket.user._id);
    });

    socket.on('chatroom:leave', function(data) {
        ChatroomController.removeUser(data.roomId, socket.user, function() {
            console.log("@#$()*@#)($*@)#(*$)(*@#$@#$");
            socketio.sockets.emit('userlist:remove', socket.user);
        });
        UserActions.leaveRoom(socket, data.roomId, socket.user._id);
    });
}

exports.registerOnce = function(socketio) {
     
}