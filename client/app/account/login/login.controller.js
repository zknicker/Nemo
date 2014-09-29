'use strict';

angular.module('nemoApp')
  .controller('LoginCtrl', function ($scope, Auth, $location) {
    $scope.user = {};
    $scope.errors = {};
    
    $scope.login = function(form) {
        $scope.submitted = true;

        if(form.$valid) {
            Auth.login({
                email: $scope.user.email,
                password: $scope.user.password
            })
            .then( function() {

            })
            .catch( function(err) {
                $scope.errors.other = err.message;
            });
        }
        
        $scope.$on('socket:connect', function(event, data) {
            $location.path('/');
        });
    };
    
  });
