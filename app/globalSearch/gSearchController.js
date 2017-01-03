(function () {
    'use strict';
    angular.module('appsworld')
    .controller('gSearchController', gSearchController);
    gSearchController.$inject = ['globalSearchContext', 'config','$scope','$stateParams','$state','commonService'];
    function gSearchController(globalSearchContext, config, $scope, $stateParams,$state,commonService) {
        var vm = this;
        vm.searchResults = [];
        vm.search = search;
        vm.go_to_selected = vm.go_to_selected
        vm.getUrl = getUrl;
        vm.isShowMessageBar = true;
        vm.message='Searching......'
        activateController();
        function activateController() {
            search($stateParams.searchText);
        }

        function search(text) {
            vm.isShowMessageBar = true;
            vm.message = 'Searching......';
            _searchResults(text);
        }

        function _searchResults(searchtext) {
            vm.searchText = searchtext;
            globalSearchContext.searchResults(searchtext).then(function (res) {
                vm.searchResults = res.data;
                if (vm.searchResults)
                    vm.isShowMessageBar = vm.searchResults.length === 0 ? true : false;
                else
                    vm.isShowMessageBar = false;
                vm.message = 'No Results found';
            });
        }

        function go_to_selected(content) {
            $state.go(getUrl(content));
        }

        function getUrl(content) {
            var _result = globalSearchContext.buildUrl(content);
            if (_result.params === 'link not found') {
                commonService.alerts('No link found for selected result item', 'No link found').error();
                return;
            }
            $state.go(_result.url, _result.params);
        }
    }
})();
