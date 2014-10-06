'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../../config/environment');

var MessageSchema = new Schema({
    content: String,
    date: { type: Date, default: Date.now },
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
});

MessageSchema.statics = {

      // Returns the most recent messages.
      loadRecent: function(cb) {
          this.find({})
              .populate({path:'author', select: 'name avatar avatarExtension'})
              .sort('-date')
              .limit(config.numMessagesOnLoad)
              .exec(cb);
          }
};

module.exports = mongoose.model('Message', MessageSchema);
