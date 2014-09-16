/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var User = require('../api/user/user.model');
var ChatroomController = require('../api/chatroom/chatroom.controller');
var socketioJwt = require('socketio-jwt');

// When the user disconnects.. perform this
function onDisconnect(socket) {

    //Chatroom.clearAllUserListsOfUser(socket.user);
    ChatroomController.removeUser(socket, socket.curChatroomId, socket.user);
}

// When the user connects.. perform this
function onConnect(socket) {
  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });

  // Insert sockets below
  require('../api/chatroom/chatroom.socket').register(socket);
  require('../api/message/message.socket').register(socket);
  require('../api/thing/thing.socket').register(socket);
}

module.exports = function (socketio) {

  // Authenticate the user on connection.
  socketio.use(require('socketio-jwt').authorize({
      secret: config.secrets.session,
      handshake: true
  }));

  // Associate a user with the token.
  socketio.use(function(socket, next) {
      User.findById(socket.decoded_token._id, function(err, user) {
          if (err) {
              return next(err);
          } else if (!user) {
              return next("Could not find a user matching id: " + socket.decoded_token._id);
          } else {
              socket.user = user;
              next();
          }
      });
  });

  socketio.on('connection', function (socket) {
    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      console.info('[%s] DISCONNECTED', socket.address);
    });

    // Call onConnect.
    onConnect(socket);
    console.info('[%s] CONNECTED', socket.address);
  });
};
