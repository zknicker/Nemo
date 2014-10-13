'use strict';

angular.module('nemoApp')
    .controller('NavbarCtrl', function ($scope, $location, Auth) {
        $scope.menu = [{
            'title': 'Home',
            'link': '/'
        }];

        $scope.isCollapsed = true;
        $scope.isLoggedIn = Auth.isLoggedIn;
        $scope.isAdmin = Auth.isAdmin;
        $scope.getCurrentUser = Auth.getCurrentUser;
    
        var user = Auth.getCurrentUser();
    
        $scope.avatarUrl = '/api/avatar/'
        if (user.avatar && user.avatarExtension) {
            $scope.avatarUrl += user.avatar + user.avatarExtension;
        } else {
            $scope.avatarUrl += 'default';   
        }

        $scope.logout = function() {
            Auth.logout();
            $location.path('/login');
        };

        $scope.isActive = function(route) {
            return route === $location.path();
        };
    });