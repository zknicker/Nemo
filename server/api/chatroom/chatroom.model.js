'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    User = require('../user/user.model');

var ChatroomSchema = new Schema({
    name: String,
    users: [ String ]
    /*users: [{
        name: String,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    }]*/
});

// Adds a user to a chatroom document.
ChatroomSchema.methods.addUser = function(user, callback) {
    console.log(user);

      this.users.push(user);
      this.save(function(err) {
          if (err) console.log("ERROR: Could not save user during call to addUser. User: " + user);
      });
};

module.exports = mongoose.model('Chatroom', ChatroomSchema);
