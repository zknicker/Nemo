'use strict';

angular.module('nemoApp')
  .controller('AdminCtrl', function ($scope, $http, Auth, User) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.delete = function(user) {
      User.remove({ id: user._id });
      angular.forEach($scope.users, function(u, i) {
        if (u === user) {
          $scope.users.splice(i, 1);
        }
      });
    };
    
    // Sockets
    $http.get('/api/sockets').success(function(sockets) {
        console.log(sockets);
        $scope.sockets = sockets;
    });
  });
