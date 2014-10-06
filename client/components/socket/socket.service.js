/* global io */
'use strict';

angular.module('nemoApp')
  .factory('socket', function(socketFactory, AuthToken, $injector) {
    
    // Functions to execute when socket.io connects to the server.
    var connectCallbacks = [];

    // Inject all socket listeners.
    connectCallbacks.push($injector.get('loginSocketConnect'));
        
    // Connect to the socket server.
    function connect() {
        var ioSocket = io('http://localhost:9000', {
            'query': 'token=' + AuthToken.get(),
            'force new connection': true,
            'sync disconnect on unload': true
        });

        var newSocket = socketFactory({
            ioSocket: ioSocket
        });
        
        newSocket.forward('connect');
        
        newSocket.forward('message:post');
        newSocket.forward('room:joined');
        newSocket.forward('userlist:add');
        newSocket.forward('userlist:remove');
        
        return newSocket;
    }

    // Default socket.
    var _socket = connect();
    
    return {
        // Exposed socket to clients.
        socket: _socket,

        // Reconnect to socket server.
        reconnect: function() {
            _socket.disconnect();
            _socket = connect();
        },

        // Disconnect from socket server.
        disconnect: function() {
            _socket.disconnect();
        },
        
        on: function(event, func) {
            _socket.on(event, func);
        },
        
      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates: function (modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        _socket.on(modelName + ':save', function (item) {
          var oldItem = _.find(array, {_id: item._id});
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        _socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

        /**
        * Removes listeners for a models updates on the socket
        *
        * @param modelName
        */
        unsyncUpdates: function (modelName) {
            _socket.removeAllListeners(modelName + ':save');
            _socket.removeAllListeners(modelName + ':remove');
        },

        sendMessage: function(message) {
            _socket.emit('message:post', { content: message });
        },

        joinRoom: function(roomId) {
            _socket.emit('chatroom:join', { roomId : roomId });
        },

        leaveRoom: function(roomId) {
            _socket.emit('chatroom:leave', { roomId: roomId });
        }
    };
  });
