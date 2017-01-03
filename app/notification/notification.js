(function () {
    'use strict';

    angular
        .module('notification', [])
        .controller('notificationController', notificationController);

    notificationController.$inject = ['$scope', '$http', '$timeout', 'commonService', 'bootstrap.dialog', 'config', 'serviceConfig'];

    function notificationController($scope, $http, $timeout, commonService, dialog, config, serviceConfig) {
        /* jshint validthis:true */
        var vm = this;
        vm.loadGrid = loadGrid;
        $timeout(callAtTimeout, 1000);
        function callAtTimeout() {
         //   vm.gridOptions = opportunitiesfactory.loadGrid('open');
              loadGrid();
        }
       

        //function getallnotifications() {
         
        //    vm.allnotications = [];
        //    vm.eventarray = [];
        //    vm.eventarray1 = [];
        //    var Url = serviceConfig.activityRemoteServer + "task/getallnotifications?userName=" + config.userName + "&$inlinecount=allpages&$orderby=CreatedDate desc&%24take=20&%24skip=0&page=1&pageSize=20"
        //    $http.get(Url).then(function (data) {
        //        vm.allnotes = data.data;
        //        for (var i = 0; i <= vm.allnotes.length - 1; i++) {
        //            vm.particiatiesmodel = vm.allnotes[i].ParticipantModel;
        //            vm.ReplyModel = vm.allnotes[i].ReplyModel;
        //            if (vm.ReplyModel != "") {
        //                if (vm.allnotes[i].FromUser == config.userName) {
        //                    vm.eventarray1.push(vm.allnotes[i]);
        //                }
        //            }
        //            angular.forEach(vm.particiatiesmodel, function (index) {
        //                vm.paname = index.UserName;
        //                if (vm.paname === config.userName && index.Status == 'Active') {
        //                    vm.eventarray1.push(vm.allnotes[i]);
        //                }
        //            })
        //        }
        //        vm.eventarray = _.uniq(vm.eventarray1, 'Id');
        //    })
        //}

        
        function loadGrid() {
          
            var url = serviceConfig.activityRemoteServer + "task/getallnotifications?userName=" + config.userName + "&$inlinecount=allpages&$orderby=CreatedDate desc"
          
            var columns =
                 [{
                     headerTemplate: '<div class="checkbox mb-0 mt-0"><input type="checkbox" ng-checked="vm.isOppChecked" id="chkOpp" ng-click="vm.allselection(data)" class="form-control"><label></label></div>',
                     "template": "<div class=\"checkbox checkboxlable\"><input type=\"checkbox\" id=\"{{dataItem.Id}}\" ng-checked=\"vm.selection.indexOf(dataItem.Id) > -1\" ng-click=\"vm.toggleSelection(dataItem.Id)\"><label for=\"\"></label></div>",
                     "width": "50px"
                 },
                 { headerTemplate: 'User Name',  field: 'FromUser', width: '200px' },
                 { headerTemplate: 'Subject', field: 'Subject', width: '120px' },
                 { headerTemplate: 'Description', field: 'Description', width: '200px' },
                 { headerTemplate: 'Reply Count', field: 'ReplyCount', width: '165px' },
                 { headerTemplate: 'Notification Date', field: 'NotificationDate', template: "<lable>{{dataItem.NotificationDate |UTCtime}}</lable>", type: "date", width: '200px', format: '{0:' + config.dateFormat + '}' },
                 ];
            return commonService.setPagedGridOptions(url, columns);
        }
        vm.allselection = function () {
            var value = document.getElementById('chkOpp').checked;
            var inputElements = document.getElementsByClassName('form-control');
            for (var i = 0; inputElements[i]; ++i) {
                if (inputElements[i].checked) {
                    value = inputElements[i].value;
                    break;
                }
            }
            vm.selection = [];
            vm.statusselection = [];
            vm.accountselection = [];
            if (value) {
                var displayedData = $("#notification").data().kendoGrid.dataSource.view();
                angular.forEach(displayedData, function (index) {
                    vm.selection.push(index.Id);
                    //vm.statusselection.push(index.Stage);
                    //vm.accountselection.push(index.Name);
                });
            }
        }
        vm.gridOptions = loadGrid();
        console.log(vm.gridOptions)

        vm.selection = [];
        vm.toggleSelection = function toggleSelection(id) {
            var idx = vm.selection.indexOf(id);
            var displayedData = $("#notification").data().kendoGrid.dataSource.view();
            if (idx > -1) {
                document.getElementById('chkOpp').checked = false;
                vm.selection.splice(idx, 1);
            }
            else {
                vm.selection.push(id);
                if (vm.selection.length === displayedData.length) {
                    document.getElementById('chkOpp').checked = true;
                };
            }
        };
      
        vm.getdelete = getdelete;
        function getdelete() {
            if (vm.selection.length ==  0) {
                commonService.notify.warning('Please select  Notification');
                return;
            }
            vm.deletenotificaton={
                UserName:config.userName,
                Ids:vm.selection
            }
            var msg;
            var title;
            msg = 'Are you sure, do you want Delete the Message?',
            title = 'Confirm Delete'
            return dialog.confirmationDialog(title, msg, 'ok', 'cancel').then(function (ok) {
                if (ok == "ok") {
                    $http.post(serviceConfig.activityRemoteServer + "task/deleteactivityNotify", vm.deletenotificaton).success(function (data) {
                        vm.selection = [];
                        $("#notification").data("kendoGrid").dataSource.read();
                    })
                }
                else {
                    vm.selection = [];
                }
            });
        }
    }

})();