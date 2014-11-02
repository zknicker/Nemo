'use strict';

var _ = require('lodash');
var socketsHelper = require('../../helpers/sockets.helper');

// Get list of socketss
exports.getSocketsForDefaultNameSpace = function(req, res) {
    var sockets = socketsHelper.getSocketsForDefaultNameSpace();
    res.json(200, sockets);
};

function handleError(res, err) {
  return res.send(500, err);
}