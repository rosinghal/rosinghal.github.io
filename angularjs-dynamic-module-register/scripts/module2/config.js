(function () {
  'use strict';

  angular
    .module('module2')
    .config(config)
    .controller('Module2Controller', Module2Controller);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('module2', {
        url: '/module2',
        templateUrl : 'scripts/module2/module2.html',
        controller: 'Module2Controller',
        controllerAs: 'vm'
      })
  }

  function Module2Controller() {
    var vm = this;
    vm.title = 'Welcome to Module 2';
  }
}());
