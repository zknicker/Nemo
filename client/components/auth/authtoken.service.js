'use strict';

angular.module('nemoApp')
    .factory('AuthToken', function AuthToken($cookieStore) {
        return {
            get: function() {
                return $cookieStore.get('token');
            }
        }
});
