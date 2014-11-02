'use strict';

var sockets = [];

/**
 * Sets a socket for user.
 */
exports.setSocketForUser = function(userId, socket) {
    sockets[userId] = socket;
}

/**
 * Disconnects the socket recorded for a user if one exists.
 */
exports.disconnectExistingSocketForUser = function(userId) {
    if (sockets[userId]) {
        sockets[userId].disconnect();   
    }
}

/**
 * Removes socket record for user.
 */
exports.forgetSocketForUser = function(userId, socket) {
    delete sockets[userId];
}

/**
 * Gets all of the sockets in the default namespace.
 */
exports.getSocketsForDefaultNameSpace = function() {
    return this.getSocketsForNamespace('/');
}

/**
 * Returns a collection of all sockets in a socketio namespace.
 */
exports.getSocketsForNamespace = function(namespace) {
    var result = [];
    for(var socket in sockets) {
        result.push(socket);  
    }
    console.log(result);
    return result;
}