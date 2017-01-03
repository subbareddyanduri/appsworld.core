(function () {
    'use strict';
    angular.module('autoform')
	.directive('detailForm', detailForm)
	.controller('detailFormController', detailFormController)
    detailFormController.$inject = ['$uibModalInstance', 'options', '$scope'];
    function detailFormController($uibModalInstance, options, $scope) {
        var vm = this;
        options.options.dataItem = options.type == 'Add' ? {} : options.options.dataItem;
        vm.formOptions = options.options;
        vm.save = save;
        vm.cancel = cancel;
        vm.ddlchange = ddlchange;
        vm.validate = validate;
        function ddlchange(field, value) {
           
        }
        function validate() {
            return { messages: [] };
        }
        function save(dataitem) {
            $uibModalInstance.close(dataitem);
        }

        function cancel() {
            $uibModalInstance.dismiss();
        }
    }
    detailForm.$inject = ['commonService', 'autoformDataContext', '$uibModal', '$templateCache'];
    function detailForm(commonService, autoformDataContext, $uibModal, $templateCache) {
        function link(scope, ele, attrs) {
            scope.show_detail = false;
            scope.detailselection = [];
            scope.add_detail = add_detail;
            scope.edit_detail = edit_detail;
            scope.delete_detail = delete_detail;
            scope.disable_detail = disable_detail;
            scope.load_td_template = load_td_template;
            scope.save = save;
            scope.cancel = cancel;
            scope.detailitem = !scope.detailitem ? {} : scope.detailitem;

            scope.toggleDetailSelection = function (dataitem) {
                var _idx = scope.detailselection.indexOf(dataitem);
                if (_idx > -1) {
                    scope.detailselection.splice(_idx, 1);
                }
                else {
                    scope.detailselection.push(dataitem);
                }
            }

            function open_model(type) {
                var instance = $uibModal.open({
                    templateUrl: 'autoform/popup.html',
                    controller: scope.options.controller||'detailFormController',
                    controllerAs: 'vm',
                    size: 'md',
                    resolve: {
                        options: function () {
                            return {
                                options: scope.options,
                                type: type
                            }
                        }
                    }
                });
                instance.result.then(function (response) {
                    save(response);
                   
                });
            }

            function add_detail() {
                function proceed() {
                    if (scope.options.actiontype == 'popup') {
                        open_model('Add');
                    }
                    else {
                        scope.show_detail = true;
                    }
                }
                proceed();
                //if (typeof (scope.options.dataItem) == 'string') {
                //    commonService.getEntities(scope.options.dataItem).then(function (data) {
                //        scope.options.dataItem = data.data;
                //        proceed();
                //    });
                //} else {
                //    scope.options.dataItem = {};
                //    proceed();
                //}


            }

            function edit_detail() {
                if (scope.detailselection.length == 0 || scope.detailselection.length > 1) {
                    commonService.notify.warning('Please select one record');
                    return;
                }
                else {
                    scope.options.dataItem = scope.detailselection[0];
                    if (scope.options.actiontype == 'popup') {
                        open_model('Edit');
                    }
                    else {
                        scope.show_detail = true;
                    }
                }
            }

            function delete_detail() {
                if (scope.detailselection.length == 0 || scope.detailselection.length > 1) {
                    commonService.notify.warning('Please select one record');
                    return;
                }
                commonService.confirmationDialog('Confirm Delete ?', 'Are you sure do you really want to Delete ?', 'Ok', 'Cancel').then(function (res) {
                    if (res == 'ok') {
                        var _idx = scope.options.dataSource.indexOf(scope.detailselection[0]);
                        if (scope.options.dataSource[_idx].RecordStatus != 'Added') {
                            scope.options.dataSource[_idx].RecordStatus = 'Deleted';
                        } else {
                            scope.options.dataSource.splice(_idx, 1)
                        }
                        scope.detailselection = [];
                    }
                });
              
            }

            function disable_detail() {
                if (scope.detailselection.length == 0 || scope.detailselection.length > 1) {
                    commonService.notify.warning('Please select one record');
                    return;
                }
                var _idx = scope.options.dataSource.indexOf(scope.detailselection[0]);
                var _status = scope.options.dataSource[_idx].Status == 'Active' ? 'Inactive' : 'Active';
                var confirmMessage = "Confirm " + _status + " ?";
                var message = "Are you sure do you really want to " + _status + " ?";
                commonService.confirmationDialog(confirmMessage,message , 'Ok', 'Cancel').then(function (res) {
                    if (res == 'ok') {
                        scope.options.dataSource[_idx].Status = scope.options.dataSource[_idx].Status == 'Active' ? 'Inactive' : 'Active';
                        scope.detailselection = [];
                    }
                });
                
            }

            function load_td_template(field) {
                if (field.td_template) {
                    $templateCache.put('myDynamicTemplate_grid_' + field.name, field.td_template);
                    return 'myDynamicTemplate_grid_' + field.name;
                }
                else
                    return 'basic_td_dplay';
            }

            function save(dataitem) {
                scope.options.dataSource = scope.options.dataSource ? scope.options.dataSource : [];
                if (scope.options.savetype == 'server') {

                }
                else {
                    var _result = autoformDataContext.isExisitingItem(scope.options.dataSource, dataitem);
                    if (!_result.isExist) { 
                        dataitem.RecordStatus = 'Added';
                        scope.options.dataSource.push(dataitem)
                    }
                    else {
                        dataitem.RecordStatus = "Modified";
                        scope.options.dataSource[_result.idx] = dataitem;
                    }
                    
                    if (scope.options.actiontype != 'popup') {
                        scope.show_detail = false;
                    }
                    commonService.notify.success("Saved data");
                    scope.detailselection = [];
                }
            }

            function cancel() {
                scope.show_detail = false;
            }
        }
        return {
            restrict: 'E',
            templateUrl: 'autoform/detailfrom.html',
            scope: {
                detailitem: '=',
                options: '='
            },
            link: link,
        }
    }

})();
