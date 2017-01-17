(function () {
  'use strict';

  angular
    .module('module')
    .config(config)
    .controller('ModuleController', ModuleController);

  function config($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('module', {
        url: '/module',
        templateUrl : 'scripts/module/module.html',
        controller: 'ModuleController',
        controllerAs: 'vm'
      })

    $urlRouterProvider.otherwise('/module');
  }

  function ModuleController() {
    var vm = this;
    vm.title = 'Welcome to Module 1';
  }
}());
