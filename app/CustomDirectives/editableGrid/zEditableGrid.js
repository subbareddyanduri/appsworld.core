//author:subbareddy

(function () {
    'use strict';
    var app = angular.module('appsworld');
    app.directive('zEditableGrid', function () {
        return {
            restrict: 'E',
            templateUrl: 'customDirectives/editableGrid/zEditableGrid.html',
            scope: {
                options: '=',
                data: '=',
                objCreateUrl: '=',
                showAddButton: '=',
                addButtonTitle: '=',
                columnTotals: '=',
                isView: '=',
                isshowaction: '=',
                footerTitle: '=',
            },
            require: 'ngModel',
            link: function (scope, ele, attr, ngModel) {
                scope.$watch('editableGridSettings', function (newVal) {
                    if (scope.editableGridSettings) {
                        ngModel.$setViewValue(newVal);
                    }
                });
            },
            controller: function ($http, $scope, $rootScope, customValidations, commonService, $templateCache) {
                $scope.editableGridSettings = { isFieldValidationRequired: false, object: [] };
                $scope.columnsTotal = {};
                $scope.isFieldValidationRequired = false;

                var _gridSettings = (function () {

                    function _addItem(value) {
                        if (value)
                            for (var i = 0; i <= value - 1; i++) {
                                if ($scope.objCreateUrl) {
                                    $http.get($scope.objCreateUrl).then(function (res) {
                                        res.data.RecordStatus = 'Added';
                                        res.data.Id = commonService.guid();
                                        $scope.data.push(res.data);
                                        $rootScope.$broadcast($scope.options.formName + '_ItemAdded');
                                    });
                                } else {
                                    $scope.data.push({});
                                }

                            }
                    }

                    function _deleteItem(index) {
                        if ($scope.data[index].RecordStatus == 'Added') {
                            $scope.data.splice(index, 1);
                        } else {
                            $scope.data[index].RecordStatus = "Deleted"
                        }
                        $rootScope.$broadcast($scope.options.formName + "_ItemDeleted");
                        if ($scope.options.footerTemplateOptions.ColumnTotals.required) {
                            angular.forEach($scope.options.footerTemplateOptions.ColumnTotals.columns, function (index, key) {
                                getColumnTotal(index);
                            })
                        }
                    }

                    function _editItem(index) {
                        $scope.data[index]
                    }

                    function _validateField(validationType, value) {
                        switch (validationType) {
                            case 'number':
                                return customValidations.validateNumber(value);
                                break;
                            case 'email':
                                return customValidations.validateEmail(value);
                                break;
                            case 'phone':
                                return customValidations.validatePhoneNumber(value);
                                break;
                            case 'required':
                                return (!value) || (value == '') ? false : true;
                                break;
                            default:
                                break;
                        }
                    }

                    function _getColumnTotal(clName) {
                        var _total = 0;
                        if ($scope.data) {
                            $scope.data.filter(function (value, index, array) {
                                if (value.RecordStatus != "Deleted") {
                                    if (!value[clName]) { value[clName] = 0; }
                                    _total = parseFloat(_total) + parseFloat(value[clName]);
                                    _total = parseFloat(_total) % 1 !== 0 ? _total.toFixed(2) : parseFloat(Math.round(_total * 100) / 100).toFixed(2);
                                }
                            });
                        }
                        return _total;
                    }
                    return {
                        addItem: _addItem,
                        deleteItem: _deleteItem,
                        editItem: _editItem,
                        validateField: _validateField,
                        getColumnTotal: _getColumnTotal
                    }
                })();

                $scope.getTemplate = function (index) {
                    if ($scope.selectedGridRow && $scope.fieldValidationRequired) { return false; }
                    //return index === $scope.selectedGridRow ? 'edit' : 'disp';
                    return 'edit';
                }

                $scope.autoCompleteOptions = {
                    select: onAutoCompleteValueSelect
                }
                $scope.setTemplate = function (td) {
                    $templateCache.put('myDynamicTemplate_' + td.Name, td.template);
                    return 'myDynamicTemplate_' + td.Name;
                }
                function onAutoCompleteValueSelect(e) {
                    var selectedItem = this.dataItem(e.item.index());
                    $rootScope.$broadcast('EGA_Changed', { data: { obect: selectedItem } });
                }

                $scope.addItem = function (value) {
                    if ($scope.selectedGridRow) { $scope.selectedGridRow = null; }
                    _gridSettings.addItem(value);
                }

                $scope.inputControlChange = function (inputCtrlName, inputCtrlValue, object, isDDL, ddlObj) {
                    var _selectedDdlObj = null;
                    if (isDDL) {
                        if (inputCtrlValue != "" && inputCtrlValue) {
                            _selectedDdlObj = ddlObj.inputControlOptions.data.filter(function (value, index, array) {
                                return value[ddlObj.inputControlOptions.valueProperty].toString() === inputCtrlValue.toString();
                            });
                        }
                    }
                    $rootScope.$broadcast($scope.options.formName + "_changed_" + inputCtrlName, { data: { value: inputCtrlValue, object: object, selectedDDLObj: _selectedDdlObj } });

                }

                $scope.deleteItem = function (index) {
                    if ($scope.selectedGridRow) { $scope.selectedGridRow = null; }
                    _gridSettings.deleteItem(index);
                }

                $scope.selectedRow = function (index, item) {
                    $scope.selectedGridRow = index;
                }

                $scope.checkFieldValidation = function (e, validationType, item) {
                    if (validationType) {
                        if (_gridSettings.validateField(validationType, e.currentTarget.value) != true) {
                            e.currentTarget.style.borderColor = 'red'
                        }
                        else {
                            e.currentTarget.style.borderColor = 'green';
                        }
                    }
                }

                $scope.validate = function (validationType, value, item) {
                    if (validationType) {
                        if (_gridSettings.validateField(validationType, value) != true) {
                            return true;
                        } else {
                            return false;
                        }
                    } else {
                        return false;
                    }
                }

                $scope.showColumnTotal = function (clName) {
                    var _isColumnFound = false;
                    $scope.options.footerTemplateOptions.ColumnTotals.columns.filter(function (value, index, array) {
                        if (value === clName) {
                            _isColumnFound = true;
                            $scope.columnsTotal[clName] = _gridSettings.getColumnTotal(clName);
                            $scope.columnTotals = $scope.columnsTotal;
                        }
                    });
                    return _isColumnFound;
                }

                $scope.getFooterTemplate = function (clName) {
                    return !$scope.showColumnTotal(clName) ? 'colsftempty' : 'colsftvalue';
                }


            }
        }
    });
})();