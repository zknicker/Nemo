'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

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
              .populate({path:'author', select: 'name'})
              .sort('-date')
              .limit(8)
              .exec(cb);
          }
};

module.exports = mongoose.model('Message', MessageSchema);
