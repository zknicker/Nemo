'use strict';

angular.module('ngApp')
  .controller('MainCtrl', function ($scope, $http, socket) {
    $http.get('/api/messages').success(function(messages) {
      $scope.messages = messages;
      socket.syncCollection($scope.messages, 'message');
    });

    $scope.addMessage = function() {
      if($scope.newMessage.length > 0) {
        $http.post('/api/messages', { poster: 'Xiris', message: $scope.newMessage });
        $scope.newMessage = '';
      }
    };

    $scope.deleteMessage = function(message) {
      $http.delete('/api/messages/' + message._id);
    };
  });
