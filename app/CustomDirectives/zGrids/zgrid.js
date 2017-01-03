(function () {
    'use strict';
    angular.module('z.grids')
    .directive('zGrids', function (zGridsContext) {
       
        return {
            restrict: 'E',
            templateUrl: 'CustomDirectives/zGrids/zgrid.html',
            scope: {
                options: '=',
                data:'='
            },            
            link: function (scope, ele, attr) {
                var selected_index;
                //scope.$parent.say('Message from directive');
                scope.selected_record = function (index) {
                    selected_index = index;
                }
                scope.td_content = function (isEditable,field) {
                    return isEditable ? field.type : 'display';
                }
                scope.row_td = function (dataItem) {
                    var _isEmpty = zGridsContext.isEmptyRow(dataItem, scope.options.fields);
                    if (_isEmpty)
                        return 'editable_td';
                    if (selected_index == scope.data.indexOf(dataItem))
                        return 'editable_td';
                   return 'display_td';
                }
            }
        }
    })
})();