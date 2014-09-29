'use strict';

angular.module('nemoApp')
  .controller('MessagelistCtrl', function ($scope, $http, userData, socket) {
    
    // Grab the initial set of available comments
    $http.get('/api/messages').success(function(messages) {
        $scope.messages = messages;

        messages.sort(function(a, b) {
            a = new Date(a.date);
            b = new Date(b.date);
            return a<b ? -1 : a>b ? 1 : 0;
        });
        
        // Socket Listeners
        $scope.$on('socket:message:post', function(event, data) {
            messages.shift(data);
            messages.push(data);
        });
    });   
  });