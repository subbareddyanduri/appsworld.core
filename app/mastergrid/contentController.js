(function () {
    'use strict';
    angular.module('appsworld')
    .controller('contentController', contentController);
    contentController.$inject = ['$scope', '$rootScope','$state','config','commonService'];
    function contentController($scope, $rootScope, $state, config,commonService) {
        var vm = this;
       
        vm.permissionBar = true;
        vm.pageTitle = pageTitle;
        vm.role = config.role;
        vm.profileStatus = 0;
        vm.navigate_to = function (state, gridparams) {
            if (state)
                $state.go(state, gridparams);
        }
        $rootScope.$on('refresh_permissions', function () { getPerBar($state); });
        $rootScope.$on('set_profile_status', function (event, args) { vm.profileStatus = args; });
        $scope.$state = $state;
        $scope.state = $state;
        vm.progressOptions = commonService.profileStatusOptions();
        function getPerBar(state) {
            vm.permissionBar = state.current.data.isPermissionBarRequired;
        }
        function pageTitle(state) {
            return state.current.data.pageTitle;
        }
        $rootScope.$on('$stateChangeSuccess', function () {
            getPerBar($state);
        });       
    }
})();