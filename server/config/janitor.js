/**
 * Cleanup tasks to run when the application starts.
 */

'use strict';

var Chatroom = require('../api/chatroom/chatroom.model');

function janitorLog(msg, done) {
    var prefix = "[JANITOR]";
    if (done === true) {
        prefix += " [DONE]";
    }
    console.log(prefix + " " + msg);
}

janitorLog("Clearing userlists in all chatrooms.", false);
Chatroom.clearAllUserLists(function() {
    janitorLog("Clearing userlists in all chatrooms.", true);
});
