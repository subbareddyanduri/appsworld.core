(function () {
    'use strict';
    angular.module('zControls', [])
        .directive('zAutoComplete', autoComplete)
    autoComplete.$inject = ['$http'];
    function autoComplete($http) {
        return {
            restrict: 'E',
            template: '<div style="overflow:auto;" id="z-autocomplete"><input type="text" ng-model="value" class="form-control " ng-change="selectedValue=null"  ng-keyup="expandAria=true;selectedValue=null"/><ul id="zautoComplete" ng-show="expandAria" style="background-color: white;padding: 1px 12px 5px 13px;overflow-y: auto;max-height: 170px;"><li class="liauto" style="cursor:pointer;padding-top:7px;" ng-repeat="item in items|filter:value" ng-click="itemSelected(item)">{{load_li_value(item)}}</li></ul></div>',
            scope: {             
                textField: '=',
                valueField: '=',
                selectedValue: "=",
                data: '=',
                selectedItem: '=',
                change:'&'
            },
            link: function (scope, ele, attr) {
                scope.expandAria = false;
                scope.items = [];
                scope.load_li_value=function(item){
                    return typeof(item)=="object"?item[scope.textField]:item;
                }
                if (typeof (scope.data) == "object") {
                    scope.items = scope.data;
                    bindTextValue();
                }
                else if (typeof (scope.data) == "string") {
                    $http.get(scope.data).then(function (response) {
                        scope.items = response.data;
                        bindTextValue();
                    });
                }
                function bindTextValue() {
                    if (scope.selectedValue) {
                        var _textField = scope.items.filter(function (value) {
                            return typeof (value) == "string" ? value == scope.selectedValue : value[scope.valueField] == scope.selectedItem;
                        })[0];
                        scope.value = typeof (_textField) == "string" ? _textField : _textField[scope.textField];
                    }
                }
                scope.itemSelected = function (item) {
                    if (item) {
                        scope.value = typeof (item) == "object" ? item[scope.textField] : item;
                        scope.selectedValue = typeof (item) == "object" ? item[scope.valueField] : item;
                        scope.selectedItem = item;
                        scope.change({ selectedObject: item });
                    }
                    scope.expandAria = false;
                }
                $(window).click(function(e){
                    if(scope.expandAria){scope.$apply(function(){scope.expandAria=false;})};
                })
                $('#zautoComplete').click(function(e){
                    e.stopPropagation();
                })
            }
        }
    }
})();


