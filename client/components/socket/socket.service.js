/* global io */
'use strict';

angular.module('nemoApp')
  .factory('socket', function(socketFactory, AuthToken) {

    function connect() {
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

    socket.on('connect', function() {
        console.log("aaaaaaaaaYO WHAT UP");
       
        window.setTimeout(function() {
        
        console.log(socket);
        socket.disconnect();
        console.log("HOLY CRAP. FORCE NEW REMOVES ALL EVENT LISTENERS. THIS EXPLAINS THINGS...");
        socket = connect();
        console.log(socket);
            
        }, 2000);
        
    });
            console.log(socket);
    socket.on('disconect', function() {
        console.log("aaaaaaaaaaaDISCONNECT YO WHAT UP");
       //$location.path('/'); 
    });
        },

        disconnect: function() {
            socket.disconnect();
        },

        on: function(cond, func) {
            socket.on(cond, func);   
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
          socket.emit('message:post', { content: message });
      },

      joinRoom: function(roomId) {
          socket.emit('chatroom:join', { roomId : roomId });
      }
    };
  });
