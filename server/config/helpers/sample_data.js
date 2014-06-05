/**
 * Populate DB with sample data
 * to disable, edit config/env/index.js, and set `sampleData: false`
 */

'use strict';

var Thing = require('../../api/thing/thing.model');
var User = require('../../api/user/user.model');

Thing.find({}).remove(function() {
  Thing.create({
    message : 'Welcome to the chat. Post a message to get started.',
    poster: 'Admin',
  });
});

User.find({}).remove(function() {
  User.create({
    provider: 'local',
    name: 'Test User',
    email: 'test@test.com',
    password: 'test'
  }, {
    provider: 'local',
    role: 'admin',
    name: 'Admin',
    email: 'admin@admin.com',
    password: 'admin'
  }, function() {
      console.log('finished populating users');
    }
  );
});