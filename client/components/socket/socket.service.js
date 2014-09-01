/* global io */
'use strict';

angular.module('nemoApp')
  .factory('socket', function(socketFactory, AuthToken) {

    function connect() {
        console.log(AuthToken.get());
        var ioSocket = io('http://localhost:9000', {
            'query': 'token=' + AuthToken.get(),
            'forceNew': true,
            'force new connection': true,
            'force new': true
        });

        var newSocket = socketFactory({
            ioSocket: ioSocket
        });

        return newSocket;
    }

    var socket = connect();

    return {
      socket: socket,

      reconnect: function() {
          socket.disconnect();
          socket = connect();
      },

      disconnect: function() {
          socket.disconnect();
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
        socket.on(modelName + ':save', function (item) {
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
        socket.on(modelName + ':remove', function (item) {
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
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      },

      sendMessage: function(message) {
          socket.emit('message:save', { content: message });
      },

      joinRoom: function(roomId) {
          socket.emit('joinRoom', { roomId : roomId });
      }
    };
  });
