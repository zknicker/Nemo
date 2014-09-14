'use strict';

/*
 * Any and all meta-data regarding a user.
 */

angular.module('nemoApp')
    .service('userData', function () {
        return {
            
            // The chatroom ID this user presides in.
            currentChatroomId: -1
        };
    });