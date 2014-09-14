'use strict';

describe('Controller: MessagelistCtrl', function () {

  // load the controller's module
  beforeEach(module('nemoApp'));

  var MessagelistCtrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    MessagelistCtrl = $controller('MessagelistCtrl', {
      $scope: scope
    });
  }));

  it('should ...', function () {
    expect(1).toEqual(1);
  });
});
