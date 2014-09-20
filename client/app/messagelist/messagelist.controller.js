'use strict';

angular.module('nemoApp')
  .controller('MessagelistCtrl', function ($scope, $http, socket, userData) {
    
    function organizeMessages() {
        // do stuff   
    }
    
    // Grab the initial set of available comments
    $http.get('/api/messages').success(function(messages) {
        $scope.messages = messages;

        messages.sort(function(a, b) {
            a = new Date(a.date);
            b = new Date(b.date);
            return a<b ? -1 : a>b ? 1 : 0;
        });
        
        socket.on('message:post', function(item) {
            
            messages.shift(item);
            messages.push(item);
        });
                  
        socket.on('message:remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
    });
  });