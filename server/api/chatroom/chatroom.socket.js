/**
 * Broadcast updates to client when the model changes
 */

'use strict';

var Chatroom = require('./chatroom.model');
var ChatroomController = require('./chatroom.controller');
var UserActions = require('../user/user.actions');

exports.register = function(socket) {

  socket.on('chatroom:join', function(data) {
      ChatroomController.addUser(socket, data.roomId, socket.user);
      UserActions.joinRoom(socket, data.roomId, socket.user._id);
  });
}
