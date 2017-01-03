(function () {
    'use strict';
    angular.module('appsworld')
    .controller('masterformController', masterformController);
    masterformController.$inject = ['commonService','$state','$stateParams','formurlsContext'];
    function masterformController(commonService,$state,$stateParams,formurlsContext) {
        var vm = this;
        activate();
        function activate() {
            commonService.getEntities($state.current.data.jsonpath + '.json').success(function (data) {
                data.saveUrl = formurlsContext[$state.current.data.file].saveUrl;
                data.lookups = formurlsContext[$state.current.data.file].lookups;
                data.saveDefaults = formurlsContext[$state.current.data.file].saveDefaults;
                vm.options = data;
            });
        }
    }
})();