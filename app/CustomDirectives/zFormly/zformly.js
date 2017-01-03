(function () {
    'use strict';
    var app = angular.module('appsworld');
    app.directive('zFormly', function ($compile) {
        return {
            restrict: 'E',
            scope:{
                model: '=',
                options:'='
            },
            link: function (scope,element) {
                scope.fieldClass = function (count) {
                    var _rows = Math.ceil(scope.options.fields.length / scope.options.columnsCount);
                    switch (parseInt(_rows)) {
                        case 1:
                            return 'col-md-12';
                            break;
                        case 2:
                            return 'col-md-6';
                            break;
                        case 3:
                            return 'col-md-4';
                            break;
                        case 4:
                            return 'col-md-3';
                            break;
                        default:
                            return 'col-md-12';
                    }
                }
            }
        }
    });
})();
       