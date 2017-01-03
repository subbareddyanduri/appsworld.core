(function () {
    'use strict';
    angular.module('reports')
    .controller('reportsController', reportsController);
    reportsController.$inject = ['reportsContext', 'formValidate', '$state', 'config'];
    function reportsController(reportsContext, formValidate, $state, config) {
        var vm = this;
        vm.gotoiframe = gotoiframe;
        vm.reportsTabClick = reportsTabClick;
        vm.getimgurl = getimgurl;
        vm.isReport = false;
        reportsContext.getTabs().then(function (tabs) {
            vm.tabs = tabs.data;
            reportsContext.getReports().then(function (response) {
                vm.totalReports = response.data;
                vm.reports = reportsContext.ReportsByTab(response.data, vm.tabs[0]);
            });
        });
        function reportsTabClick(tabName) {
            vm.reports = reportsContext.ReportsByTab(vm.totalReports, tabName);
        }
        function gotoiframe(report) {
            reportsContext.getReportById(report.Id).then(function (res) {                
                //var uri = res.data.ReportURL.split('//');
                //uri = uri[0] +'//'+ res.data.UserName + ':' + res.data.Password +'@'+uri[1];
                //vm.isReport = true;
                //var uri = 'http://appsworld.southeastasia.cloudapp.azure.com/appsworld.report/report/report?ReportName=' + res.data.ReportName + '&ReportPath=' + res.data.ReportPath + '&CompanyId=' + config.companyId;
                //document.getElementById('report').setAttribute('src', uri);


               // for old reports
                vm.isReport = true;
                var report = res.data.ReportURL.split('/');

                var uri = 'http://appsworld.southeastasia.cloudapp.azure.com/appsworld.report/report/report?ReportName=' + report[report.length - 1] + '&ReportPath=' + report[report.length - 2] + '&CompanyId=' + config.companyId;
                document.getElementById('report').setAttribute('src', uri);
                //  window.open(uri, '_self');
            });          
        }
        function getimgurl(ThumNail) {
            return ThumNail;
        }
    }

   

})();