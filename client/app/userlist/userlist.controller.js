'use strict';

angular.module('nemoApp')
  .controller('UserlistCtrl', function ($scope, $http, socket, userData) {

    function removeUser(arr, user) {
        var i = arr.length - 1;
        while(i >= 0) {
            if (arr[i]._id == user._id) {
                console.log(arr);
                arr.splice(i, 1);
                console.log(arr);
            }
            i--;
        }
        return arr;
    }
    
    socket.socket.on('joinedRoom', function(data) {
        console.log("YO");
        // Grab the initial list of online users
        $http.get('/api/chatrooms/' + userData.currentChatroomId + '/users').success(function(users) {
            console.log(users);
            $scope.users = users;
        });
    });
    
    socket.socket.on('userlist:add', function(data) {
        $scope.users.push(data);   
    });
    
    socket.socket.on('userlist:remove', function(data) {
        removeUser($scope.users, data); 
    });
  });
