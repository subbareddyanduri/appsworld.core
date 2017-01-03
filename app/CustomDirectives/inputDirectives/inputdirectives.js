(function () {
    'use strict';
    var inputs = angular.module('appsworld');
    inputs.directive('zNumber', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.on('keypress', function (e) {
                    if (e.keyCode >= 48 && e.keyCode <= 57) {
                        return true;
                    } else {
                        return false;
                    }
                });
            }
        }
    });

    //used in bean cursor
    //converts negative values in paranthasis and adding commas ...using in bean cursor   -78666624.458 converts (7,86,66,624.46)
    //should not change the ngModel(-78666624.458) value display element only change
    inputs.directive('zCurrency', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            scope: {
                ngModel: '=',
                maxDecimalPlaces: '=',
                maxPlaces: '=',
                isEdit: '=',
            },
            link: function (scope, element, attrs, ngModel) {
                function edit() {
                    var b = element[0].value;
                    if (parseFloat(element[0].value.replace(/[$,]/g, "")) > 0) {
                        var c = parseFloat(Number(b.replace(/[^0-9\.]+/g, "")));
                        var a = parseFloat(c);
                        element[0].value = a.toLocaleString('en-IN', { minimumFractionDigits: 2 });
                        ngModel.$modelValue = a;
                        scope.ngModel = a;
                    }
                    else if (!element[0].value || element[0].value == 0 || element[0].value == 0.00) {}
                    else {
                        var e = parseFloat(Number(b.replace(/[^0-9\.]+/g, "")));
                        var f = parseFloat(e);
                        element[0].value = '(' + Math.abs(f).toLocaleString('en-IN', { minimumFractionDigits: 2 }) + ')';
                        ngModel.$modelValue = -f;
                        scope.ngModel = -f;
                    }
                    if (scope.$root.$$phase != '$apply' && scope.$root.$$phase != '$digest') {
                        scope.$apply();
                    }
                    return;
                }
                if (scope.isEdit) {
                    scope.$watch(attrs.ngModel, function (newValue) {
                        edit();
                    });
                }
                element.on('blur', function () {
                    edit();
                });
                element.bind('focus', function () {
                    element[0].value = scope.ngModel;
                });
                var maxPlaces = !scope.maxPlaces ? 15 : scope.maxPlaces;
                element.on('keypress', function (e) {
                    if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 46 || e.keyCode == 45) {
                        if (element[0].value.lastIndexOf('.') == -1 && parseInt(element[0].value.length) === parseInt(maxPlaces) && e.keyCode != 46) {
                            return false;
                        }
                        if (e.keyCode == 46 && element[0].value.lastIndexOf('.') != -1) {
                            return false;
                        }
                        else {
                            var decimalPlacesLength;
                            if (scope.maxDecimalPlaces) {
                                if (element[0].value.lastIndexOf('.') != -1) {
                                    decimalPlacesLength = element[0].value.substring(element[0].value.lastIndexOf('.'), element[0].value.length - 1).length;
                                    if (Number(decimalPlacesLength === scope.maxDecimalPlaces) && (parseInt(e.currentTarget.selectionStart) > element[0].value.lastIndexOf('.') || parseInt(e.currentTarget.selectionStart) === parseInt(maxPlaces))) {
                                        return false;
                                    }
                                    else { return true; }
                                }
                            }
                            else { return true; }
                        }
                    } else { return false; }
                });
            }
        }
    })


    //This directive should not allow minus
    inputs.directive('zDecimal', function () {
        return {
            restrict: 'A',
            scope: {
                maxDecimalPlaces: '=',
                maxPlaces: '='
            },
            link: function (scope, element, attr) {
                var maxPlaces = !scope.maxPlaces ? 15 : scope.maxPlaces;
                element.on('keypress', function (e) {
                    if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 46) {
                        if (element[0].value.lastIndexOf('.') == -1 && parseInt(element[0].value.length) === parseInt(maxPlaces) && e.keyCode != 46) {
                            return false;
                        }
                        if (e.keyCode == 46 && element[0].value.lastIndexOf('.') != -1) {
                            return false;
                        }
                        else {
                            var decimalPlacesLength;
                            if (scope.maxDecimalPlaces) {
                                if (element[0].value.lastIndexOf('.') != -1) {
                                    decimalPlacesLength = element[0].value.substring(element[0].value.lastIndexOf('.'), element[0].value.length - 1).length;
                                    if (Number(decimalPlacesLength === scope.maxDecimalPlaces) && (parseInt(e.currentTarget.selectionStart) > element[0].value.lastIndexOf('.') || parseInt(e.currentTarget.selectionStart) === parseInt(maxPlaces))) {
                                        return false;
                                    }
                                    else {
                                        return true;
                                    }
                                }
                            }
                            else {
                                return true;
                            }
                        }
                    } else {
                        return false;
                    }
                });
            }
        }
    });

    //This directive should allow minus
    inputs.directive('zMinusDecimal', function () {
        return {
            restrict: 'A',
            scope: {
                maxDecimalPlaces: '=',
                maxPlaces: '='
            },
            link: function (scope, element, attr) {
                var maxPlaces = !scope.maxPlaces ? 15 : scope.maxPlaces;
                element.on('keypress', function (e) {
                    if (e.keyCode >= 48 && e.keyCode <= 57 || e.keyCode == 46 || e.keyCode == 45) {
                        if (element[0].value.lastIndexOf('.') == -1 && parseInt(element[0].value.length) === parseInt(maxPlaces) && e.keyCode != 46) {
                            return false;
                        }
                        if (e.keyCode == 46 && element[0].value.lastIndexOf('.') != -1) {
                            return false;
                        }
                        else {
                            var decimalPlacesLength;
                            if (scope.maxDecimalPlaces) {
                                if (element[0].value.lastIndexOf('.') != -1) {
                                    decimalPlacesLength = element[0].value.substring(element[0].value.lastIndexOf('.'), element[0].value.length - 1).length;
                                    if (Number(decimalPlacesLength === scope.maxDecimalPlaces) && (parseInt(e.currentTarget.selectionStart) > element[0].value.lastIndexOf('.') || parseInt(e.currentTarget.selectionStart) === parseInt(maxPlaces))) {
                                        return false;
                                    }
                                    else {
                                        return true;
                                    }
                                }
                            }
                            else {
                                return true;
                            }
                        }
                    } else {
                        return false;
                    }
                });
            }
        }
    });

    inputs.directive('zString', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {

            }
        }
    });

    inputs.directive('zAlphaN', function () { });
    inputs.directive('zPhone', function () { });
    inputs.directive('zEmail', function () { });
    inputs.directive('zDate', function ($moment) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                element.on('keypress', function (e) {
                    if (e.keyCode >= 45 && e.keyCode <= 57) {
                        return true;
                    } else {
                        return false;
                    }
                });
                element.on('blur', function (e) {
                    var _inputValue = e.currentTarget.value;
                    var _dateFormat = e.currentTarget.dataset.format;
                    if (_inputValue) {
                        var _formatedValue = $moment(_inputValue, _dateFormat).format(_dateFormat);
                        if (_dateFormat === 'DD/MM/YYYY' && _formatedValue != 'Invalid date' && _formatedValue.length >= 6) {
                            var _date = _formatedValue.split('/');
                            var _yearPart2 = _date[2].substring(2, _date[2].length);
                            var _year;
                            if (parseInt(_date[2].substring(0, 2)) == 0) { _year = new Date().getFullYear().toString().substring(0, 2) + _yearPart2; }
                            else {
                                _year = _date[2];
                            }
                            e.currentTarget.value = $moment(_date[0] + "/" + _date[1] + "/" + _year, _dateFormat).format(_dateFormat);
                        }
                        else {
                            e.currentTarget.value = _formatedValue;
                        }
                    };
                });
            }
        }
    });
    inputs.directive('zTaxRate', function () {
        return {
            restrict: 'A',
            require: 'ngModel',
            link: function (scope, ele, attr, ngModel) {
                function setValue() {
                    if (ngModel) {
                        if (!ngModel.$viewValue || ngModel.$viewValue == "") {
                            var modelVal = null;
                            var viewval = 'NA';
                            ngModel.$modelValue = modelVal;
                            ngModel.$viewValue = "NA";
                            ngModel.$render();
                        }
                    }
                }
                scope.$watch(function () {
                    return ngModel.$modelValue;
                }, function (newVal, oldVal) {
                    setValue();
                })
            }
        }
    });
    // used in bean cursor journal screen
    inputs.directive('jvLogInfo', function () {
        return {
            restrict: 'E',
          template: '<div class="row" id="beanloginfo"><div class="showonclick"><a ng-click="vm.load_info()" style="color: #146eb4 !important;">Click to {{vm.isLogInfo?"hide":"show"}} info</a></div><br> <table ng-if="vm.isLogInfo" class="table table-stripped table-responsive"><thead><tr><th ng-repeat="thead in vm.info[0]">{{thead}}</th></tr></thead><tbody><tr ng-repeat="item in vm.info"> <td ng-repeat="td in vm.info[0]">{{item[td]}}</td> </tr></tbody></table></div>',
            controllerAs: "vm",
            controller: ["commonService", "serviceConfig", "$scope", function (commonService, serviceConfig, $scope) {
                var vm = this;
                vm.load_info = load_info;
                vm.isLogInfo = false;
                function load_info() {
                    vm.isLogInfo = !vm.isLogInfo;
                    //var _url = 'http://appsworld.southeastasia.cloudapp.azure.com:91/AWBeantst/api/mastermodule/gethistory?CompanyId='+$scope.options.companyId+'&id='+$scope.options.id+'&type='+$scope.options.type;
                    var _url = serviceConfig.beanAuthenticationRemoteServer+'gethistory?CompanyId='+$scope.options.companyId+'&id='+$scope.options.id+'&type='+$scope.options.type;
                    if (vm.isLogInfo) {
                        commonService.getEntities($scope.options.url || _url).then(function (response) {
                            vm.info = response.data;
                        });
                    }
                }
            }],
            scope: {
                options: '='
            },
            link: function (scope, ele, attr) {

            }
        }
    })







})();