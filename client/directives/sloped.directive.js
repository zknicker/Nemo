/**
 * A directive that fires when the document is resized.
 */

'use strict';

angular.module('nemoDirectives').directive('sloped', ['$document', '$window', function($document, $window) {
    
    return {
        link: function (scope, element, attrs) {
            
            scope.onResize = function() {
                var angle = 1.2 / ($document.width() / 3440);
                
                $(element).css({
                   'transform': 'rotate(-' + angle + 'deg)' 
                });
            }
            
            scope.onResize();
            
            angular.element($window).bind('resize', function() {
                scope.onResize();
            });
        }
    }
}]);