(function () {
    'use strict';
    angular.module('reports', [])
    .factory('reportsContext', reportsContext);
    reportsContext.$inject = ['serviceConfig','commonService','config','$state'];
    function reportsContext(serviceConfig, commonService, config,$state) {
        var moduleName=$state.current.name.indexOf('client')!=-1?'CC':'BC';
        var service = {
            getTabs: getTabs,
            getReports: getReports,
            ReportsByTab: ReportsByTab,
            getReportById: getReportById
        }
        return service;
        function getTabs() {
            var uri = serviceConfig.hrCursorsRemoteServer + 'gettabnames?companyId='+config.companyId+'&moduleName='+moduleName+'&tabNames';
            return commonService.getEntities(uri);
        }
        function getReports() {
            var uri = serviceConfig.hrCursorsRemoteServer + 'getreports?companyId=' + config.companyId + '&moduleName=' + moduleName + '&tabNames';
            return commonService.getEntities(uri);
        }
        function ReportsByTab(object, tabname) {
            if (tabname == 'All Reports') {
                var _names = [];
                var _allReports = [{ReportVms:[]}];
                for (var i = 0; i <= object.length - 1; i++) {
                    for (var j = 0; j <= object[i].ReportVms.length - 1; j++) {
                        if (_names.indexOf(object[i].ReportVms[j].Name) == -1)
                        {
                            _names.push(object[i].ReportVms[j].Name)
                            _allReports[0].ReportVms.push(object[i].ReportVms[j]);
                        }
                    }
                }
                return _allReports;
            }
            return object.filter(function (value) {
                return value.TabNames.indexOf(tabname) !=-1;
            })
        }

        function getReportById(reportId) {
            return commonService.getEntities(serviceConfig.hrCursorsRemoteServer + 'getserverreport?reportId=' + reportId);
        }
    }
})();