'use strict';

angular.module('nemoApp')
  .controller('MainCtrl', function ($scope, $http, socket) {

    $scope.newMessage = '';

    // Grab the initial set of available comments
    $http.get('/api/messages').success(function(messages) {
      $scope.messages = messages;

      // Update array with any new or deleted items pushed from the socket
      socket.syncUpdates('message', $scope.messages, function(event, message, messages) {
        // This callback is fired after the comments array is updated by the socket listeners

        // sort the array every time its modified
        messages.sort(function(a, b) {
          a = new Date(a.date);
          b = new Date(b.date);
          return a>b ? -1 : a<b ? 1 : 0;
        });
      });
    });

    // Get the ID of the test room.
    var testRoomId;
    $http.get('/api/chatrooms/alpha').success(function(data) {
        testRoomId = data.id;

        // Add user to the room.
        socket.joinRoom(testRoomId);

        socket.socket.on('joinedRoom', function(data) {
            // Grab the initial list of online users
            $http.get('/api/chatrooms/' + testRoomId + '/users').success(function(users) {
                console.log(users);
                $scope.users = users;
            });
        });
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
