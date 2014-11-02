'use strict';

var nemo = angular.module('nemoApp')
nemo.controller('MainCtrl', function ($scope, $http, socket, userData, modal) {

    $scope.$on('socket:room:joined', function(event, data) {
        $scope.joinedRoom = true;
    });
    
    $scope.$on('socket:disconnect', function() {
        modal.disconnected();
    });
    
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

console.log(nemo);

nemo.animation('.test', function () {
  return {
    beforeAddClass : function(element, className, done) {
        console.log("called");
        if (className === 'ng-enter') {
            element.animo("rotate", { degrees: 45 });
        }
    },
    removeClass : function(element, className, done) {
        console.log("called remove");
        // nothing
    }
  };
});