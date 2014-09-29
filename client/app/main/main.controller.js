'use strict';

angular.module('nemoApp')
  .controller('MainCtrl', function ($scope, $http, socket, userData) {

    $scope.newMessage = '';

    // Add user to the room.
    userData.currentChatroomId = "5409543babbcbd641a55c7b5";
    socket.joinRoom(userData.currentChatroomId);

    // Clean up listeners when the controller is destroyed
    $scope.$on('$destroy', function () {
        socket.unsyncUpdates('message');
    });

    $scope.addComment = function() {
        socket.sendMessage($scope.newMessage);
        $scope.newMessage = '';
    };
    
    $scope.$on("$destroy", function() {
        socket.leaveRoom(userData.currentChatroomId);
    });
  });
