'use strict';

angular.module('nemoApp')
  .controller('UserlistCtrl', function ($scope, $http, socket, userData) {

    var users = [];
    $scope.users = users;
    
    $scope.$on('socket:userlist:add', function(event, data) {
        users.push(data);   
    });

    $scope.$on('socket:userlist:remove', function(event, data) {
        console.log("received");
        removeUser(users, data); 
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