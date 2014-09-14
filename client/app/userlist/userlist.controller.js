'use strict';

angular.module('nemoApp')
  .controller('UserlistCtrl', function ($scope, $http, socket, userData) {

    socket.socket.on('joinedRoom', function(data) {
        // Grab the initial list of online users
        $http.get('/api/chatrooms/' + userData.currentChatroomId + '/users').success(function(users) {
            console.log(users);
            $scope.users = users;
        });
    });
  });
