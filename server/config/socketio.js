/**
 * Socket.io configuration
 */

'use strict';

var config = require('./environment');
var User = require('../api/user/user.model');
var ChatroomController = require('../api/chatroom/chatroom.controller');
var socketioJwt = require('socketio-jwt');
var socketsHelper = require('../helpers/sockets.helper');

// Executed when the client socket disconnects.
function onDisconnect(socketio, socket) {
    console.log('disconnected');
    ChatroomController.removeUser(socket.curRoomId, socket.user, function() {
        console.log('callback');
        socketio.sockets.emit('userlist:remove', socket.user);
    });
}

// Executed when the client socket connects.
function onConnect(socketio, socket) {
    
    // When the client emits 'info', this listens and executes
    socket.on('info', function (data) {
        console.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
    });
        
    // Register per-socket listeners.
    socket.removeAllListeners();
    require('../api/chatroom/chatroom.socket').register(socketio, socket);
    require('../api/message/message.socket').register(socketio, socket);
}

module.exports = function (socketio) {

    // Register global listeners.
    require('../api/chatroom/chatroom.socket').registerOnce(socketio);
    require('../api/message/message.socket').registerOnce(socketio);
    
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
        console.info('[%s] CONNECTED', socket.address);
        
        if (socket.handshake.address !== null) {
            socket.address = socket.handshake.address.address + ':' + socket.handshake.address.port;
        } else {
            socket.address = process.env.DOMAIN;   
        }

        socket.connectedAt = new Date();

        // Disconnect any existing session for user. Set the user's new socket.
        socketsHelper.disconnectExistingSocketForUser(socket.user._id);
        socketsHelper.setSocketForUser(socket.user._id, socket);
        
        onConnect(socketio, socket);
        
        socket.on('disconnect', function () {
            socketsHelper.forgetSocketForUser(socket.user._id);
            onDisconnect(socketio, socket);
            console.info('[%s] DISCONNECTED', socket.address);
        });
    });
};
