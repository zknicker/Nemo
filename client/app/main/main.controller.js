'use strict';

angular.module('nemoApp')
  .controller('MainCtrl', function ($scope, $http, socket, userData) {

    $scope.newMessage = '';

    // Get the ID of the test room.
    var testRoomId;
    $http.get('/api/chatrooms/alpha').success(function(data) {

        // Add user to the room.
        userData.currentChatroomId = data.id;
        socket.joinRoom(userData.currentChatroomId);
    });

    // Clean up listeners when the controller is destroyed
    $scope.$on('$destroy', function () {
        socket.unsyncUpdates('message');
    });

    $scope.addComment = function() {
        socket.sendMessage($scope.newMessage);
        $scope.newMessage = '';
    };
  });
