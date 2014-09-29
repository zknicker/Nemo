'use strict';

angular.module('nemoApp')
  .controller('UserlistCtrl', function ($scope, $http, socket, userData) {
    
    $scope.$on('socket:joinedRoom', function(event, data) {
        // Grab the initial list of online users
        $http.get('/api/chatrooms/' + userData.currentChatroomId + '/users').success(function(users) {
            console.log("users: ");
            console.log(users);
            $scope.users = users;
        });
    });

    $scope.$on('socket:userlist:add', function(event, data) {
        $scope.users.push(data);   
    });

    $scope.$on('socket:userlist:remove', function(event, data) {
        removeUser($scope.users, data); 
    });
        
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
  });