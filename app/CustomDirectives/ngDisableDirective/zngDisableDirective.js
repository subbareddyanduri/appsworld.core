angular.module("zngDisableDirective", [])
   .directive("zDisable", function () {
       return {
           restrict: "A",
           link: function (scope, element, attr) {
               scope.$on("kendoWidgetCreated", function (e, widget) {
                   var value = scope.$eval(attr.zDisable);

                   $(widget.body).attr("contenteditable", !value);

                   scope.$watch(attr.zDisable, function (value) {
                       $(widget.body).attr("contenteditable", !value);
                   });
               })
           }
       }
   });