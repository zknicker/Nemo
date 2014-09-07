'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('../user/user.model');

var ChatroomSchema = new Schema({
    name: String,
    users: [{ type: Schema.ObjectId, ref: 'User' }]
});

// Clear all users from every chat room's user list.
ChatroomSchema.statics.clearAllUserLists = function(callback) {
    this.find({}, function(err, rooms) {
        rooms.forEach(function(room) {
            room.users = undefined;
            room.save();
        });

        if (callback) callback();
    });
}

// Remove a user from everyone chat room's user list.
ChatroomSchema.statics.clearAllUserListsOfUser = function(user, callback) {
    this.find({}, function(err, rooms) {
        rooms.forEach(function(room) {
            room.users.remove(user);
            room.save();
        });

        if (callback) callback();
    });
}

// Adds a user to a chatroom document.
ChatroomSchema.methods.addUser = function(user, callback) {
    this.users.push(user);
    this.save(function(err) {
      if (err) console.log("ERROR: Could not save user during call to addUser. User: " + user);
    });
};

// Removes a user from a chatroom document.
ChatroomSchema.methods.removeUser = function(user, callback) {
    this.users.remove(user);
    this.save(function(err) {
      if (err) console.log("ERROR: Could not remove user during call to removeUser. User: " + user);
    });
};

module.exports = mongoose.model('Chatroom', ChatroomSchema);
