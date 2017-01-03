(function () {
    'use strict';
    angular.module('appsworld')
    .factory('globalSearchContext', globalSearchContext);
    globalSearchContext.$inject = ['config','commonService','serviceConfig','$state'];
    function globalSearchContext(config, commonService, serviceConfig, $state) {
        var service = {
            searchResults: searchResults,
            buildUrl:buildUrl
        };

        return service;

        function searchResults(searchtext) {
            var company = $state.current.name.includes('companies') && config.role === 'Super User' ? 'Company' : '';
            var url = serviceConfig.elasticSearchRemoteServer + 'GlobalSearch?startIndex=0&noOfRecords=20&companyId=' + config.companyId + '&searchCriteria=' + searchtext + '&moduleName=' + $state.current.name.split('.')[0]+'&company='+company;
            return commonService.getEntities(url);
        }
        function buildUrl(content) {
            var _allStates = $state.get();
            var _requestedState = _allStates.filter(function (value, index, array) {
                return value.name === content.URL;
            });
            var params = function () {
                try{
                    var _par = _requestedState[0].url.split('?');
                    var _par1 = _requestedState[0].url.split('/:');
                }
                catch (error) {
                    return 'link not found';
                }
                _par = _par || _par1;
                _par = _par.length > 1 ? _par : _par1;
                var _staeParams = {};
                for (var i = 1; i <= _par.length - 1; i++) {
                    if (_par[i].toLowerCase() === 'id') { _staeParams[_par[i]] = 'Id'; }
                    else {
                        _staeParams[_par[i]] = _par[i];
                    }
                                     
                }
                for (var key in _staeParams) {
                    if (key === 'Id'||key==='id') {
                        _staeParams[key] = content["Id"];
                    }
                    else if (_staeParams[key].toLowerCase() == 'isview') {
                        _staeParams[key] = true;
                    }
                    else if (_staeParams[key].toLowerCase() == 'mode') {
                        _staeParams[key] = 'view';
                    }
                    else if (_staeParams[key].toLowerCase() == 'form') {
                        _staeParams[key] = content.Type;
                    }
                    
                }
                return _staeParams;
            }
            return {url:content.URL,params:params() };
        }
    }
})();