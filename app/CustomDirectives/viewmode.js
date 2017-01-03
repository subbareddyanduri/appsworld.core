(function () {
    'use strict';
    angular.module('appsworld')
    .directive('viewMode', function () {
        return {
            restrict: 'A',
            scope: {
                view:'='
            },
            link: function (scope,ele,attr) {
                var _fields = $(ele).find(':input');
                if (attr.viewMode == true || attr.viewMode == 'true') {
                    for (var i = 0; i <= _fields.length - 1; i++) {
                        if (_fields[i].id == 'answerInput-hidden') { _fields[i].hidden = true; }
                        if (_fields[i].id != 'answerInput-hidden')
                            _fields[i].disabled = true;
                    }
                }                
            }
        }
    });
})();