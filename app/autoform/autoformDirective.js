(function () {
    'use strict';

    angular
        .module('autoform')
        .directive('autoform', autoform)
        .directive('autoformdate', function () {
            return {
                restrict: 'A',
                require: 'ngModel',
                scope: {},
                link: function (scope, ele, attr, ngModel) {
                    ngModel.$modelValue = ngModel.$modelValue ? new Date($modelValue) : null;
                    scope.ngModel = ngModel.$modelValue;
                }

            }
        })

    autoform.$inject = ['$window', 'autoformDataContext', 'formValidate', '$state', 'config', 'commonService', '$templateCache'];

    function autoform($window, autoformDataContext, formValidate, $state, config, commonService, $templateCache) {
        var directive = {
            link: link,
            templateUrl: 'autoform/autoform.html',
            scope: {
                options: '=',
                ddlchange: '&',
                popSave: '&',
                popCancel: '&',
                cancel: '&',
                data: '=',
                validate: '=',
                validateFields: '&',
                inputChange: '&'
            },
            restrict: 'E'
        };
        return directive;

        function link(scope, element, attrs) {

            scope.validationMessages = [];

            scope.dataItem = {};

            activate();

            function activate() {
                if (typeof (scope.options.lookups) == 'string') {
                    autoformDataContext.load_data(scope.options.lookups).then(function (response) {
                        scope.look_up_source = response.data;
                        set_dataitem();
                    });
                }
                else {
                    scope.look_up_source = scope.options.lookups;
                    set_dataitem();
                }
            }

            function set_date_fields(data) {
                var _dateFields = scope.options.fields.filter(function (value) {
                    return value.type == 'date';
                });
                for (var i = 0; i < _dateFields.length; i++) {
                    data[_dateFields[i].name] = data[_dateFields[i].name] ? new Date(data[_dateFields[i].name]) : null;
                }
                return data;
            }

            function set_dataitem() {
                if (typeof (scope.options.dataItem) == 'string') {
                    autoformDataContext.load_data(scope.options.dataItem).then(function (res) {
                        scope.dataItem = set_date_fields(res.data);
                        scope.data = scope.dataItem;
                        if (scope.options.isdetail) {
                            scope.options.detailOptions.dataSource = res.data[scope.options.detailsource];
                        }

                    });
                } else {
                    scope.dataItem = scope.options.dataItem ? set_date_fields(scope.options.dataItem) : {};
                    scope.data = scope.dataItem;
                }
            }

            scope.load_template = function (field) {
                if (field.template) {
                    $templateCache.put('myDynamicTemplate_input_' + field.name, field.template);
                    return 'myDynamicTemplate_input_' + field.name;
                }
                else
                    return field.type;
            }
            scope.input_change = function (fieldname, value) {
                scope.inputChange({ fieldname: fieldname, value: value });
            }
            scope.load_class = function (item) {
                switch (scope.options.displaycolumns) {
                    case 1:
                        return item.Class ? item.Class : 'col-md-12 col-sm-12 col-xs-12';
                    case 2:
                        return item.Class ? item.Class : 'col-md-6 col-sm-6 col-xs-12';
                    case 3:
                        return item.Class ? item.Class : 'col-md-4 col-sm-6 col-xs-12';
                    case 4:
                        return item.Class ? item.Class : 'col-md-3 col-sm-6 col-xs-12';
                    default:
                        return item.Class ? item.Class : 'col-md-3 col-sm-6 col-xs-12';
                }
            }

            scope.load_inputcontrol_class = function (item) {
                return item.clases ? item.clases : '';
            }

            scope.save_item = function () {
                scope.validationMessages = [];
                if (formValidate.validate(scope.options.formname).isValidationRequired) {
                    scope.validationMessages.push({ Message: 'Invalid data please verify!' })
                }
                else {
                    if (scope.validate) {
                        if (scope.validateFields().messages.length != 0) {
                            scope.validationMessages = scope.validateFields().messages;
                            return;
                        }
                    }
                    if (scope.options.savetype == 'server') {
                        if (scope.options.isdetail) {
                            scope.dataItem[scope.options.detailsource] = autoformDataContext.set_save_defaults(scope.options.detailOptions.dataSource, scope.options.detailOptions.saveDefaults);
                        }
                        var _save = autoformDataContext.save_item(scope.options.saveDefaults, scope.dataItem, scope.options.saveUrl);
                        _save.then(function () {
                            commonService.notify.success('Saved data');
                            if (scope.options.ispopup) {
                                scope.popSave({ dataItem: scope.dataItem });
                            } else {
                                if (scope.options.state) {
                                    $state.go(scope.options.state);
                                }
                            }
                        });
                        _save.error(function (res) {
                            scope.validationMessages.push({ Message: res.Message });
                        })
                    }
                    else if (scope.options.savetype == 'local') {
                        if (scope.options.ispopup) {
                            scope.popSave({ dataItem: scope.dataItem });
                        }
                    }

                }
            }
          
            scope.cancel_item = function () {
                scope.cancel();
                if (scope.options.ispopup) {
                    scope.popCancel();
                }
                else {
                    if (scope.options.state) {
                        $state.go(scope.options.state);
                    }
                }
            }

            scope.hide_field = function (item, dataItem, griditem) {
                return !eval(item.hidden);
            }

            scope.ddl_change = function (item) {
                scope.ddlchange({ item: item, selected_value: scope.dataItem[item.name] });
            }

            scope.load_ddl_source = function (item) {
                if (scope.look_up_source) {
                    if (item.options.ds == ".") {
                        return scope.look_up_source;
                    }
                    if (item.options.ds == "") { return []; }
                    else {
                        return typeof (item.options.ds) == 'object' ? item.options.ds : (eval('scope.look_up_source.' + item.options.ds) ? eval('scope.look_up_source.' + item.options.ds) : []);
                    }

                }
                else {
                    return item.options.ds && item.options.ds != "" ? item.options.ds : [];
                }
            }

            scope.load_grid_td = function (field) {
                if (field.td_template) {
                    $templateCache.put('myDynamicTemplate_' + field.name, field.td_template);
                    return 'myDynamicTemplate_' + field.name;
                }
                else {
                    return 'td_display';
                }
            }

            scope.load_input_label_dp = function (field) {
                if (field.template) {
                    $templateCache.put('myDynamicTemplate_label_' + field.name, field.template);
                    return 'myDynamicTemplate_label_' + field.name;
                }
                else {
                    return 'input_label_dp';
                }
            }

            scope.dateFormat = config.dateFormat;

            scope.datePickers = autoformDataContext.date_pickers(scope.options.fields);

            scope.dateOptions = {
                format: config.dateFormat,
                'class': 'datepicker',
                showWeeks: false
            }

            scope.openDatePicker = function ($event, open) {
                $event.preventDefault();
                $event.stopPropagation();
                scope.datePickers[open] = scope.datePickers[open] == true ? false : true;
            }
        }

    }

})();