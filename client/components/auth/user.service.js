'use strict';

angular.module('nemoApp')
    .factory('User', function ($resource) {
        return $resource('/api/users/:id/:controller', {
            id: '@_id'
        },
        {
            changePassword: {
                method: 'PUT',
                params: {
                    controller:'password'
                }
            },
            changeAvatar: {
                method: 'PUT',
                params: {
                    controller:'avatar'   
                }
            },
            get: {
                method: 'GET',
                params: {
                    id:'me'
                }
            }
        });
    });