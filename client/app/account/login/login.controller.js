'use strict';

angular.module('nemoApp')
  .controller('LoginCtrl', function ($scope, Auth, $location, socket) {
    $scope.user = {};
    $scope.errors = {};
    console.log(socket.socket);
    socket.on('connect', function() {
        console.log("YO WHAT UP");
       $location.path('/'); 
    });
    socket.on('disconect', function() {
        console.log("DISCONNECT YO WHAT UP");
       //$location.path('/'); 
    });

    $scope.login = function(form) {
      $scope.submitted = true;

      if(form.$valid) {
        Auth.login({
          email: $scope.user.email,
          password: $scope.user.password
        })
        .then( function() {
          // Logged in, redirect to home
          //$location.path('/');
        })
        .catch( function(err) {
          $scope.errors.other = err.message;
        });
      }
    };
    
  });
