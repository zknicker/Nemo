'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ThingSchema = new Schema({
  message: String,
  poster: String,
  active: Boolean
});

module.exports = mongoose.model('Thing', ThingSchema);