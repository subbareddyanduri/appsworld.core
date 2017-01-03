(function () {
    'use strict';
    angular.module('appsworld')
    .directive('zSmartGrid', function (commonService,$rootScope) {
        return {
            restrict: 'E',
            templateUrl:'CustomDirectives/smartEdit.html',
            scope: {
                data: '=',
                options:'='
            },
            link: function (scope, element, attr) {
                var _selectedIndex = null;
                scope.datePicker = {};
                scope.$watch('options', function () {
                    if (scope.options)
                    {
                        var _dateControls = scope.options.fields.filter(function (value, index, array) {
                            return value.inputControl === 'datepicker'
                        });
                        if (_dateControls && _dateControls.length != 0) {
                            angular.forEach(_dateControls, function (index, key) {
                                scope.datePicker[_dateControls[key].inputControlOptions.isOpen] = false;
                            });
                        }

                    }
                });           
                scope.rowSelected = function (index) { _selectedIndex = index; }

                scope.getTemplate = function (index) {
                    return index == _selectedIndex ? 'edit' : 'display';
                }

                scope.getEditControl = function (type) {
                    return type;
                }

                scope.addItem = function () {
                    scope.data.push({ Id: commonService.guid() });
                }

                scope.deleteItem = function (index) {
                    scope.data.splice(index, 1);
                }

                scope.inputControlValueChanged = function (object, value, inputControlName, type,id,data,valProp) {
                    if (type == 'ddl')
                    {
                        value = data.filter(function (value, index, array) { return value[valProp] === id });
                    }
                    $rootScope.$broadcast(scope.options.formName + '_' + inputControlName + '_changed', { data: { dataItem: object, value: value } });
                }
                // Date Pickers

                scope.dateOptions = {
                    format: 'dd/MM/yyyy',
                    'class': 'datepicker'
                };
                scope.formats6 = ['dd/MM/yyyy'];
                scope.format6 = scope.formats6[0];

                scope.open = function ($event, opened) {
                    $event.preventDefault();
                    $event.stopPropagation();
                    scope.datePicker[opened] = scope.datePicker[opened] === true ? false : true;
                };
            }
        }
    })
})();