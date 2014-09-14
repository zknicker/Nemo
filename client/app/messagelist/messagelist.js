'use strict';

angular.module('nemoApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('messagelist', {
        url: '/messagelist',
        templateUrl: 'app/messagelist/messagelist.html',
        controller: 'MessagelistCtrl'
      });
  });