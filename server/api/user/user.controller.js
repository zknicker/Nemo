'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');
var util = require('util');
var formidable = require('formidable');
var fs = require('fs-extra');
var avatarHelper = require('../../helpers/avatar.helper');
var _ = require('lodash');

var validationError = function(res, err) {
    return res.json(422, err);
};

/**
 * Get list of users
 */
exports.index = function(req, res) {
    User.find({}, '-salt -hashedPassword', function (err, users) {
        if(err) return res.send(500, err);
        res.json(200, users);
    });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
    var newUser = new User(req.body);
    newUser.provider = 'local';
    newUser.role = 'user';
    newUser.save(function(err, user) {
    if (err) return validationError(res, err);
        var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
        res.json({ token: token });
    });
};

/**
 * Get a single user
 */
exports.show = function (req, res, next) {
    var userId = req.params.id;

    User.findById(userId, function (err, user) {
        if (err) return next(err);
        if (!user) return res.send(401);
        res.json(user.profile);
    });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
    var userId = req.user._id;
    var oldPass = String(req.body.oldPassword);
    var newPass = String(req.body.newPassword);

    // Update the user's password info in the DB.
    User.findById(userId, function (err, user) {
        if(user.authenticate(oldPass)) {
            user.password = newPass;
            user.save(function(err) {
                if (err) return validationError(res, err);
                res.send(200);
            });
        } else {
            res.send(403);
        }
    });
};

exports.changeAvatar = function(req, res, next) {
    avatarHelper.uploadAvatar(req, res, function(fileName, fileExtension) {
        
        // Update the user's avatar record in the DB.
        User.findById(req.user._id, function (err, user) {
            if (err) return validationError(res, err);
            user.avatar = fileName;
            user.avatarExtension = fileExtension;
            user.save(function(err) {
                if (err) return validationError(res, err);
                res.send(200);
            });
        });
    });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
    var userId = req.user._id;
    User.findOne({ _id: userId }, '-salt -hashedPassword', function(err, user) {
        if (err) return next(err);
        if (!user) return res.json(401);
        res.json(user);
    });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
    res.redirect('/');
};
