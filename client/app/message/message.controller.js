'use strict';

angular.module('nemoApp')
    .controller('Message', function ($scope) {
        $scope.avatar = '/api/avatar/' + $scope.message.author.avatar + $scope.message.author.avatarExtension;
    });
