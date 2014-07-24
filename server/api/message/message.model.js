'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var MessageSchema = new Schema({
  message: String,
  poster: String,
  active: Boolean
});

module.exports = mongoose.model('Message', MessageSchema);
