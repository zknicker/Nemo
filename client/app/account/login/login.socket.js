'use strict';

angular.module('nemoApp')
    .factory('loginSocketConnect', function($location) {
    
    var onConnect = function() {
        $location.path('/');
    }
    
    return onConnect;
});