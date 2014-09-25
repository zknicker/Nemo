'use strict';

var User = require('./user.model');

exports.joinRoom = function(socket, roomId, userId) {
    User.findByIdAndUpdate(userId, { curRoom: roomId });
    socket.curRoomId = roomId;
};