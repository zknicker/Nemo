'use strict';

angular.module('nemoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('userlist', {
        url: '/userlist',
        templateUrl: 'app/userlist/userlist.html',
        controller: 'UserlistCtrl'
      });
  });