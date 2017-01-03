/*
author:SubbaReddy
Date:05/01/2016
Description:this file is Common For All MasterGrids 
*/
/// <reference path="../app_configuration.js" />

(function () {
    'use strict';
    angular.module('masterGrids')
        .controller('masterGrid', masterGrid)
    masterGrid.$inject = ['masterGridDataContext', '$state', 'commonService', 'config', '$scope', '$controller', 'bootstrap.dialog', '$uibModal', '$stateParams'];
    function masterGrid(masterGridDataContext, $state, commonService, config, $scope, $controller, dialog, $uibModal, $stateParams) {
        var vm = this;
        // Methods Declaration
        vm.Add = addItem;
        vm.Edit = editItem;
        vm.Disable = disableItem;
        vm.clearFilters = clearFilters;
        vm.refresh = refresh;
        vm.saveLayOut = saveGridLayout;
        vm.getViewMode = getViewMode;
        vm.isAdmin = config.role == 'admin' ? true : false;
        //vm.AddCreditMemo = addCreditMemo;
        //vm.Void = voidTransaction;
        //vm.Reverse = reverseTransaction;
        //vm.AddDoubtFullDebt = addDoubtfulldebt;
        vm.viewHistory = viewHistory;
        //vm.Copy = Copy;
        //vm.Delete = Delete;
        vm.getlink = getlink;
        vm.changeText = changeText;
        vm.ConvertToEmployee = ConvertToEmployee;//For Convert To Employee Icon
        var historyModelController = $scope.$new();
        $controller('historyController', { $scope: historyModelController });
        vm.title = '';
        // variables Declaration
        var _layOut;
        vm.currentUrl = $state.current.url;
        vm.masterGridOptions = [];
        window.scrollTo(0, 0);
        vm.selection = [];
        var _actionOptions = null;
        $scope.$on('actionHandler', function (event, action) {
            var _actions = ['Add', 'Edit', 'Disable', 'getViewMode', 'refresh', 'clearFilters', 'saveLayOut', 'viewHistory', 'changeText', 'getlink', 'ConvertToEmployee'];
            if (_actions.indexOf(action) != -1) { vm[action](); }
            else { other_actions(action); }

        });
        vm.toggleSelection = function toggleSelection(item) {
            var idx = vm.selection.indexOf(item);
            vm.selectedRowStatus = item.Status;
            //if (vm.selection) {
            //    vm.selection = [];
            //}
            // is currently selected
            if (idx > -1) {
                vm.selection.splice(idx, 1);
            }
            // is newly selected
            else {
                vm.selection.push(item);
            }
        };

        setGridLayout();
        vm.btnText = 'Copy Link';
        function changeText(dataItem) {
            //vm.btnText = 'Copied!!';
            if (dataItem.Status === 'Active') {
                commonService.notify.success('Copied Successfully');
            }
            else {
                commonService.notify.success(' You cannot Copy this link');
            }

        }

        function getlink(dataItem) {
            if (dataItem.Status == "Active") {
                var link = '{' + dataItem.ApplicationLink + '}';
                link = link.replace('/\\/g', '');
                var _request = JSON.stringify({ itemInfo: link, configInfo: { companyName: config.companyName, companyId: config.companyId, userRole: config.role, userName: config.userName, state: "jobapplication" } });
                return 'http://192.168.0.100:90/appsworld.unsl.dev/app/index.html#/request?requestString=' + _request;
            }
        }

        function _hideColumns(columns) {
            for (var key in columns) {
                $("#masterGrid").hideColumn(columns[key]);
            }
            $("#masterGrid").data("kendoGrid").setOptions($("#masterGrid").data("kendoGrid").getOptions());
        }
        function _removeColumns(columns) {
            $("#masterGrid").data("kendoGrid").columns = masterGridDataContext.remove_columns($("#masterGrid").data("kendoGrid").columns, columns);
            $("#masterGrid").data("kendoGrid").setOptions($("#masterGrid").data("kendoGrid").getOptions());
        }
        function setGridLayout() {
            masterGridDataContext.loadGrid(vm.currentUrl).then(function (res) {
                _layOut = res.data;
                _actionOptions = _layOut.Options;
                vm.title = _layOut.Title;
                if ($state.current.name === 'admin.companies' && config.role === 'Super User') { _layOut.IsExisting = false; }
                if (!_layOut.IsExisting) {
                    $('#masterGrid').data("kendoGrid").setOptions(masterGridDataContext.getGridOptions(_layOut.APIMethod, _layOut.GridMetaData1));

                }
                else {
                    var _options = JSON.parse(_layOut.GridMetaData1);
                    _options.dataSource.transport = {
                        read: _layOut.APIMethod.split('?')[0],
                        parameterMap: function (data, options) {
                            var params = masterGridDataContext.load_additionalParams();
                            if (params == '')
                                return JSON.stringify(data) + '&companyId=' + config.companyId;
                            else
                                return JSON.stringify(data) + '&companyId=' + config.companyId + params;
                        }
                    };
                    $('#masterGrid').data("kendoGrid").setOptions(_options);

                }
                // managing columns
                if (masterGridDataContext.manage_columns().remove_columns) {
                    _removeColumns(masterGridDataContext.manage_columns().remove_columns)
                }
                if (masterGridDataContext.manage_columns().hide_columns) {
                    _hideColumns(masterGridDataContext.manage_columns().hide_columns)
                }
            });
        }


        function _getparams(type, dataItem) {
            if (_layOut.Params) {
                var Params = JSON.parse(_layOut.Params);
                var _params = {};
                angular.forEach(Params, function (index) {
                    _params[index.key] = index.takeFromGrid ? (!dataItem ? 'new' : dataItem[index.key]) : index.value;
                });
                return _params;
            } else {
                return null;
            }
        }

        function addItem() {
            if (_layOut.ActionURL == 'admin.wfconfigurations.incidentalclaim') {
                model_popup();
                return;
            }
            var _params = _getparams('add', null);
            $state.go(_layOut.ActionURL, _params);
        }

        function editItem() {
            if (vm.selection.length > 1 || vm.selection.length < 1) {
                commonService.notify.warning('Please Select one Record');
                return;
            }
            if (_layOut.ActionURL == 'admin.wfconfigurations.incidentalclaim') {
                model_popup();
                return;
            }
            $state.go(_layOut.ActionURL, _getparams('edit', vm.selection[0]));
        }
        function disableItem() {
            if (vm.selection.length < 1) {
                commonService.notify.warning('Please select at least one record');
                return;
            }
            function _disable() {
                var title;
                if (vm.selection.length === 1) {
                    if (vm.selection[0].Status === 'Active') { title = 'Confirm Inactive ?' }
                    else { title = 'Confirm Active ?' }
                }
                else if (vm.selection.length > 1) { title = 'Confirm Active/Inactive ?'; }
                var message = 'Do you really want to ';
                if (vm.selection.length === 1) {
                    if (vm.selection[0].Status === 'Active') { message = message + 'Inactive ?' }
                    // else { title = 'Active ?' }
                    else { message = message + 'Active ?' }
                }
                else if (vm.selection.length > 1) { message = message + 'Active/Inactive ?'; }
                var _ids = [];
                var _status = [];
                angular.forEach(vm.selection, function (index) {
                    _ids.push(index.Id);
                    _status.push(index.Status);
                });
                commonService.confirmationDialog(title, message, 'Ok', 'Cancel').then(function (response) {
                    // commonService.alerts.warning(message).then(function (response) {
                    if (response === 'ok') {
                        var obj = { id: _ids, tableName: _layOut.TableName, status: _status, UserName: config.userName };
                        var _disableItem = masterGridDataContext.disableItems(obj);
                        _disableItem.then(function (response) {
                            commonService.notify.success('Saved data');
                            clearFilters();
                        });
                        _disableItem.error(function (err) {
                            commonService.alerts(err.Message || err).error();
                            vm.selection = [];
                        });
                    }
                    if (response === 'cancel') {
                        vm.selection = [];
                    }
                });
            }

            if ($state.current.data.pageTitle === 'Companies') {
                if (vm.selection[0].Status === 'Active' && config.role != 'Super User') {
                    return dialog.confirmationDialog('Company Deactivation', 'Deactivating your company will Effect ongoing transactions of the company', 'Ok', 'Cancel').then(function (ok) {
                        if (ok === 'ok') {
                            return _disable();
                        }
                        if (ok === 'cancel') {
                            vm.selection = [];
                        }
                    });
                } else if (vm.selection[0].Status === 'Inactive') {
                    return _disable();
                } else if (vm.selection[0].Status === 'Active' && config.role === 'Super User') {
                    return _disable();
                }
            } else {
                _disable();
            }

        }

        function saveGridLayout() {
            vm.selection = [];
            _layOut.GridMetaData1 = JSON.stringify($('#masterGrid').data("kendoGrid").getOptions());
            _layOut.IsModified = true;
            masterGridDataContext.saveGridLayOut(_layOut).then(function () {
                commonService.notify.success('Layout Saved');
                setGridLayout();
            });
        }

        function _reloadGrid() {
            $('#masterGrid').data("kendoGrid").dataSource.read();

        }

        function clearFilters() {
            $("#masterGrid").data("kendoGrid").dataSource.filter([]);
            //_reloadGrid();
            vm.selection = [];
        }

        function refresh() {
            vm.selection = [];
            clearFilters();
        }

        function getViewMode(dataItem) {
            if (_layOut.ActionURL == 'admin.wfconfigurations.incidentalclaim') {
                model_popup(dataItem.Id);
                return;
            }
            var _params = _getparams('view', dataItem);
            if (config.role === 'admin') {
                masterGridDataContext.isEditPermissionApplied().then(function (response) {
                    _params.isView = response.data.Metadata["Edit"] == "True" ? false : true;
                    $state.go(_layOut.ActionURL, _params);
                });
            }
            else {
                _params.isView = false;
                $state.go(_layOut.ActionURL, _params);
            }


        }

        function other_actions(action) {
            if (vm.selection.length === 0 || vm.selection.length > 1) {
                commonService.notify.warning('Please select one record');
                return;
            }
            _extraOptions(action, vm.selection[0]);
        }
        function model_popup(id) {
            open_model_popup('md', 'incidentalclaims.html', 'incidentalclaimController', id);
        }
        function open_model_popup(size, template_url, controller, id) {
            var modelInstance = $uibModal.open({
                templateUrl: template_url,
                controller: controller,
                controllerAs: 'vm',
                size: size,
                resolve: {
                    options: function () {
                        return { size: size, id: vm.selection.length != 0 ? vm.selection[0].Id : (id ? id : null) };
                    }
                }
            });
            modelInstance.result.then(function () {
                refresh();
                _reloadGrid();
            });
        }

        function viewHistory() {
            if (vm.selection.length > 1 || vm.selection.length < 1) {
                commonService.notify.warning('Please Select one Record');
                return;
            }
            historyModelController.open('lg', _layOut.StreamName, _layOut.ViewModelName, vm.selection[0].Id);
            vm.selection = [];
        }

        function _extraOptions(actionType, dataItem) {
            var _options = null;
            _layOut.Options ? _options = JSON.parse(_layOut.Options) : null;
            var _isActionRequired = _options[actionType].IsAction;
            var _isNavigationSwitch = _options[actionType].IsNavigationSwitch;
            function _getparams() {
                var _prams = {}
                angular.forEach(_options[actionType].Params, function (index, key) {
                    index.IsTakeFromGrid ? _prams[index.key] = dataItem[index.DataField] : '';
                    index.IsTakeFromConfig ? _prams[index.key] = config[index.DataField] : '';
                    !index.IsTakeFromGrid && !index.IsTakeFromConfig ? _prams[index.key] = config[index.key] : '';
                });
                return _prams;
            }
            if (_isActionRequired) {
                commonService.confirmationDialog(_options[actionType].ActionTitle, _options[actionType].ActionMessage, 'Ok', 'Cancel').then(function (response) {
                    if (response === 'ok') {
                        if (_options[actionType].serviceType == 'post') {
                            var _result = commonService.saveEntity(masterGridDataContext.sub_action_url(_options, vm.selection[0], actionType, false), _getparams());
                            _result.then(function () {
                                refresh();
                            });
                            _result.error(function (err) {
                                commonService.alerts('Action ignored', err.Message || err).error();
                            });
                        }
                        else {
                            var _result = commonService.getEntities(masterGridDataContext.sub_action_url(_options, vm.selection[0], actionType, true));
                            _result.then(function () {
                                refresh();
                            });
                            _result.error(function (err) {
                                commonService.alerts('Action ignored', err.Message || err).error();
                            });
                        }

                    }
                });
            }
            else if (_isNavigationSwitch) {
                $state.go(_options[actionType].ActionURL, _getparams());
            }
        }

        //function Copy() {
        //    if(vm.selection.length===0||vm.selection.length>1){
        //        commonService.notify.warning('Please select one record');
        //        return;
        //    }
        //    _extraOptions('Copy');
        //}

        //function Delete() {
        //    if (vm.selection.length === 0 || vm.selection.length > 1) {
        //        commonService.notify.warning('Please select one record');
        //        return;
        //    }
        //    _extraOptions('Delete');
        //}

        //ConvertToEmployee popup

        function ConvertToEmployee() {
            if (vm.selection.length > 1 || vm.selection.length < 1) {
                commonService.notify.warning('Please select  one record');
                return;
            }
            for (var i = 0; i < vm.selection.length; i++) {
                if (vm.selection[i].EmployeeId == null) {
                    var modelInstance = $uibModal.open({
                        templateUrl: 'convertoemployee.html',
                        controller: 'ConvertToEmployee',
                        controllerAs: 'vm',
                        size: 'md',
                        backdrop: 'static',
                        resolve: {
                            options: function () {
                                return {
                                    id: vm.selection[0].Id
                                }
                            }
                        }
                    });
                    modelInstance.result.then(function (response) {
                        vm.selection = [];
                        refresh();
                    });
                }
                else {
                    commonService.confirmationDialog('Confirmation', 'The Applicant was already created as a employee,Do you wanted us to take you to employee form', 'Ok', 'Cancel').then(function (data) {
                        if (data == 'ok') {
                            $state.go('hr.empmanagement.employee', { Id: vm.selection[0].EmployeeId })
                        } if (data == 'cancel') {
                            vm.selection = [];
                        }
                    })

                }
            }

        }
    }

})();
