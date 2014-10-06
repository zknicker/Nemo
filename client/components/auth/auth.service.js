'use strict';

angular.module('nemoApp')
    .factory('Auth', function Auth($location, $rootScope, $http, User, $cookieStore, $q, socket) {
        var currentUser = {};
        if($cookieStore.get('token')) {
            currentUser = User.get();
        }

        return {

            login: function(user, callback) {
                var cb = callback || angular.noop;
                var deferred = $q.defer();

                // Verify login.
                $http.post('/auth/local', {
                    email: user.email,
                    password: user.password
                }).
                    success(function(data) {
                    $cookieStore.put('token', data.token);
                    currentUser = User.get();
                    deferred.resolve(data);

                    // Reconnect to the socket server.
                    console.log("Reconnecting..."); console.log(socket);
                    socket.reconnect();

                    return cb();
                }).
                error(function(err) {
                    this.logout();
                    deferred.reject(err);
                    return cb(err);
                }.bind(this));

                return deferred.promise;
            },

            logout: function() {
                $cookieStore.remove('token');
                currentUser = {};

                // Disconnect from the socket service.
                socket.disconnect();
            },

            createUser: function(user, callback) {
                var cb = callback || angular.noop;

                return User.save(user,
                    function(data) {
                        $cookieStore.put('token', data.token);
                        currentUser = User.get();
                        return cb(user);
                    },
                    function(err) {
                        this.logout();
                        return cb(err);
                    }.bind(this)).$promise;
            },

            changePassword: function(oldPassword, newPassword, callback) {
                var cb = callback || angular.noop;

                return User.changePassword({ id: currentUser._id }, {
                    oldPassword: oldPassword,
                    newPassword: newPassword
                }, function(user) {
                    return cb(user);
                }, function(err) {
                    return cb(err);
                }).$promise;
            },
                
            changeAvatar: function(avatar, callback) {
                var cb = callback || angular.noop;

                return User.changeAvatar({ id: currentUser._id }, {
                    avatar: avatar
                }, function(user) {
                    return cb(user);
                }, function(err) {
                    return cb(err);
                }).$promise;
            },

            /**
             * Gets all available info on authenticated user
             */
            getCurrentUser: function() {
                return currentUser;
            },

            /**
             * Check if a user is logged in
             */
            isLoggedIn: function() {
                return currentUser.hasOwnProperty('role');
            },

            /**
             * Waits for currentUser to resolve before checking if user is logged in
             */
            isLoggedInAsync: function(cb) {
                if(currentUser.hasOwnProperty('$promise')) {
                    currentUser.$promise.then(function() {
                        cb(true);
                    }).catch(function() {
                        cb(false);
                    });
                } else if(currentUser.hasOwnProperty('role')) {
                    cb(true);
                } else {
                    cb(false);
                }
            },

            /**
             * Check if a user is an admin
             */
            isAdmin: function() {
                return currentUser.role === 'admin';
            }
        };
    });
