'use strict';

var User = require('./user.model');

exports.joinRoom = function(socket, roomId, userId) {
    User.findByIdAndUpdate(userId, { curRoom: roomId });
    socket.curRoomId = roomId;
};

exports.leaveRoom = function(socket, roomId, userId) {
    User.findByIdAndUpdate(userId, { curRoom: null });
    socket.curRoomId = null;
};