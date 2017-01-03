(function () {
    'use strict';
    angular.module('appsworld')
    .directive('initialSettings', initialSettings)
    initialSettings.$inject = ['framework', '$state','$rootScope','config'];
    function initialSettings(framework, $state, $rootScope, config) {
        function link(scope, ele, attr) {
            if (config.companyId) {
                $(ele).addClass('initialsettings');
                var loading_ele = angular.element('<div class="splash-title intial_loading"><img src="content/images/logo-gif.gif"><p style="margin: 8px 0px 4px 110px;">AppsWorld is a big webapp who deals with all the module related to accountancy in one place. </p></div>');
                $(ele[0].parentElement).append(loading_ele);
                framework.company_settings().then(function () {
                    $(ele).removeClass('initialsettings');
                    $('.intial_loading').remove()
                });
            }            
        }
        return {
            restrict: 'A',
            scope: {},
            link: link,
        }
    }
})();