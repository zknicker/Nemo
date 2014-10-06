'use strict';

var _ = require('lodash');
var formidable = require('formidable');
var fs = require('fs-extra');
var avatarHelper = require('../../helpers/avatar.helper');
var config = require('../../config/environment');

// Get an avatar.
exports.getAvatar = function(req, res) {
    avatarHelper.getAvatar(req, res);
};