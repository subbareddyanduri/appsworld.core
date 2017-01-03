(function () {
    'use strict';
    angular.module('appsworld')
    .directive('navigationBar', navigation);
    navigation.$inject = ['framework','$state','$stateParams','$compile','config'];
    function navigation(framework, $state, $stateParams, $compile, config) {
        function link(scope, ele, attr) {
            scope.$state = $state;
            var module = angular.copy(scope.moduleName);
            if (scope.moduleName == 'Admin') { module = config.role.toLowerCase() == 'super user' ? 'Super User' : scope.moduleName; }
            framework.module_details(module).then(function (response) {
                ele.html(framework.module_links(response.data));
                $compile(ele.contents())(scope);
            });
            scope.setModuleDetailId=function (id) {
                window.localStorage.setItem('ModuleDetailId', id);
            }
        }
        return {
            restrict: 'A',
           // replace:true,
            scope: {
               moduleName:'='
            },
            link:link
        }
    }
})();