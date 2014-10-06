'use strict';

angular.module('nemoApp')
  .controller('SettingsCtrl', function ($scope, User, Auth, $upload) {
    $scope.errors = {};

    $scope.changePassword = function(form) {
        $scope.submitted = true;
        if(form.$valid) {
            Auth.changePassword($scope.user.oldPassword, $scope.user.newPassword)
            .then( function() {
                $scope.message = 'Password successfully changed.';
            })
            .catch( function() {
                form.password.$setValidity('mongoose', false);
                $scope.errors.other = 'Incorrect password';
                $scope.message = '';
            });
        }
    };
    
    $scope.onFileSelect = function($files) {
        //$files: an array of files selected, each file has name, size, and type.
        for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            
            $scope.upload = $upload.upload({
                url: '/api/users/me/avatar', //upload.php script, node.js route, or servlet url
                method: 'PUT',
                data: {myObj: $scope.myModelObj},
                file: file,
                
            }).progress(function(evt) {
                console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                
            }).success(function(data, status, headers, config) {
                console.log(data);
            }).error(function(err) {
                console.log(err); 
            });
        }
      };
  });
