/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Chatroom = require('./chatroom.model');
var ChatroomController = require('./chatroom.controller');

exports.register = function(socket) {

  socket.on('joinRoom', function(data) {
      ChatroomController.addUser(socket, data.roomId, socket.user);
  });
}
