'use strict';

var _ = require('lodash');
var Chatroom = require('./chatroom.model');

// Get a list of chatrooms.
exports.index = function(req, res) {
  Chatroom.find(function (err, chatrooms) {
    if(err) { return handleError(res, err); }
    return res.json(200, chatrooms);
  });
};

// Get the roomId of the alpha test chatroom.
exports.getTestRoom = function(req, res) {
  Chatroom.find({ name: 'Alpha House' }, function (err, room) {
    if(err) { return handleError(res, err); }
    return res.json(200, { id: room[0]._id });
  });
};

// Create a new chatroom (ONLY CALL THIS ONCE O_O).
exports.create = function(req, res) {
  Chatroom.create({ name: 'Alpha House' }, function(err, chatroom) {
    if(err) { return handleError(res, err); }
    return res.json(201, chatroom);
  });
};

// Close an existing chatroom.
exports.close = function(req, res) {
  Chatroom.findById(req.params.id, function (err, chatroom) {
    if(err) { return handleError(res, err); }
    if(!chatroom) { return res.send(404); }
    chatroom.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// Add a user to a chatroom.
exports.addUser = function(socket, chatroomId, user) {
    Chatroom.findById(chatroomId, function(err, chatroom) {
        chatroom.addUser(user);
        if (!err && chatroom) {
            socket.emit('joinedRoom', {});
            socket.broadcast.emit('userlist:add', user);
        }
    });
};

// Removes a user from a chatroom.
exports.removeUser = function(socket, chatroomId, user) {
    Chatroom.findById(chatroomId, function(err, chatroom) {
        if (!err && chatroom) chatroom.removeUser(user);
        socket.broadcast.emit('userlist:remove', user);
    });
};

// Get users in a chatroom.
exports.getUsers = function(req, res) {
    Chatroom.findById(req.params.id)
        .populate('users', 'name role')
        .exec(function(err, chatroom) {
            if (err) { return handleError(res, err); }
            return res.send(200, chatroom.users);
        });
};

// Get messages in a chatroom.
exports.messages = function(req, res) {
  Chatroom.findById(req.params.id, function (err, chatroom) {
    if(err) { return handleError(res, err); }
    if(!chatroom) { return res.send(404); }
    return res.json(chatroom);
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
