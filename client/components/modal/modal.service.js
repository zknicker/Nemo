'use strict';

angular.module('nemoApp')
    .factory('modal', function () {
        return {
            disconnected: function() {
                swal({
                    title: "Disconnected",
                    text: "The disconnection monster has devoured your session. This can sometimes be caused by being inactive for too long, opening the chat in another window, or simple server error.",
                    type: "warning",
                    showCancelButton: false,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Reload",
                    closeOnConfirm: false 
                }, function(){
                    location.reload();
                });   
            }
        }
    });