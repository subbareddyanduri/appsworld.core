(function () {
    'use strict';
    angular.module('autoform', [])
    .factory('autoformDataContext', autoformDataContext)
    .directive('toString', function () {
        return {
            restrict: 'A',
            require:'ngModel',
            scope: {
                ngModel:'='
            },
            link: function (scope,ele,attr,ngModel) {
                if (typeof (ngModel.$modelValue) == 'number') {
                    scope.$watch(function () {
                        return scope.ngModel;
                    }, function (newVal) {
                        if (newVal) {
                            scope.ngModel = scope.ngModel.toString();
                        }
                    });
                }
            }
        }
    })
    autoformDataContext.$inject = ['commonService', '$stateParams', 'config'];
    function autoformDataContext(commonService, $stateParams, config) {
        var service = {
            load_data: load_data,
            date_pickers: date_pickers,
            save_item: save_item,
            isExisitingItem: isExisitingItem,
            set_save_defaults: set_save_defaults,
            set_ds: set_ds,
        };

        return service;

        function load_data(url) {
            return commonService.getEntities(url);
        }

        function date_pickers(fields) {
            var obj = {};
            var _result = fields.filter(function (value) {
                return value.type == 'date';
            });
            for (var i = 0; i <= _result.length - 1; i++) {
                obj[_result[i].name] = false;
            }
            return obj;
        }

        function set_ds(fieldname, fields, data) {
            for (var i = 0; i < fields.length; i++) {
                if (fields[i].name == fieldname) {
                    fields[i].options.ds = data;
                }
            }
            return fields;
        }
        function save_item(defaults, dataitem, url) {
            for (var key in defaults) {
                dataitem[key] = defaults[key];
            }
            dataitem.Status = $stateParams.Id || $stateParams.id == 'new' ? 'Active' : dataitem.Status;
            dataitem.CompanyId = config.companyId;
            if ($stateParams.Id || $stateParams.id == 'new') {
                dataitem.CreatedDate = new Date();
                dataitem.UserCreated = config.userName;
            } else {
                dataitem.ModifiedDate = new Date();
                dataitem.ModifiedBy = config.userName;
            }
            return commonService.saveEntity(url, dataitem);
        }
        function set_save_defaults(datasource, defaults) {
            if (datasource) {
                for (var i = 0; i <= datasource.length - 1; i++) {
                    for (var key in defaults) {
                        datasource[i][key] = defaults[key];
                    }
                }
            }
            return datasource;
        }
        function isExisitingItem(datasource, dataitem) {
            var _result = { isExist: false, idx: null }
            datasource.filter(function (value, index, array) {
                if (value.Id == dataitem.Id) {
                    _result.isExist = true;
                    _result.idx = index;
                }
            });
            return _result;
        }
    }
})();