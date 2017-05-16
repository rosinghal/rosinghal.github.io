(function () {
  'use strict';

  angular
    .module('upload')
    .component('uploadFile', {
      templateUrl: 'js/upload/upload.html',
      controller: UploadController,
      controllerAs: 'vm'
    });

  function UploadController($scope, $timeout, $sce, $http) {
    var vm = this;
    vm.files = {};
    vm.progress = 0;
    vm.checkStatus = checkStatus;
    vm.wistiaApiPassword = "b32a71acd5b3a1bab3447ac253eaa80d5c8bfaf3ba1235bb788f6bf56a24790f";

    $('#fileupload').fileupload({
      url: 'https://upload.wistia.com',
      dataType: 'json',
      maxChunkSize: 1024 * 1024 * 10, // 10 MB
      formData: {
        api_password: vm.wistiaApiPassword
      },
      add: function (e, data) {
        data.submit();
      },
      done: function (e, data) {
        if (data.result.hashed_id) {
          var hashed_id = data.result.hashed_id;
          vm.files[hashed_id] = {
            // url: null,
            name: data.result.name,
            hashed_id: hashed_id,
            status: data.result.status
          };
          vm.checkStatus(hashed_id);
        }
      },
      progressall: function (e, data) {
        if (data.total > 0) {
          $scope.$apply(function(){
            vm.progress = parseInt(data.loaded / data.total * 100, 10);
          });
        }
      }
    });

    function checkStatus(hashed_id) {
      var file = vm.files[hashed_id];
      $http({
        method: 'GET',
        url: 'https://api.wistia.com/v1/medias/' + hashed_id + '.json?api_password=' + vm.wistiaApiPassword
      }).then(function (response) {
        file.status = response.data.status || '';
        if (file.status === 'ready') {
          file.embedCode = $sce.trustAsHtml(response.data.embedCode);
          // file.url = $sce.trustAsResourceUrl('http://fast.wistia.net/embed/iframe/' + hashed_id);
        } else if (vm.files[hashed_id].status !== 'failed') {
          $timeout(function(){
            vm.checkStatus(hashed_id);
          }, 2000);
        }
      });
    }
  }
}());
