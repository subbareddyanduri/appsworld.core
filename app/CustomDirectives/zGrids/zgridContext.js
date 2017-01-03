(function () {
    'use strict';
    angular.module('z.grids', [])
    .factory('zGridsContext', zGridsContext);
    zGridsContext.$inject = [];
    function zGridsContext() {
        var service = {

        }
        service.isEmptyRow = function (dataItem,fields) {            
            var _emptyfieldcount = 0;
            angular.forEach(fields, function (index) {
                if (!dataItem[index.name])
                    _emptyfieldcount++;
            });
            return _emptyfieldcount===fields.length;
        }
        return service;
    }
})();