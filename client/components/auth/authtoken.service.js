'use strict';

angular.module('nemoApp')
    .factory('AuthToken', function AuthToken($cookieStore) {
        return {
            get: function() {
                console.log("HERE");
                return $cookieStore.get('token');
            }
        }
});
