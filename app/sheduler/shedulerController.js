(function () {
    'use strict';

    angular.module('appsworld')
            .controller('shedulerController', shedulerController);
    shedulerController.$inject = ['shedulerContext'];
    function shedulerController(shedulerContext) {
        var vm = this;
        vm.shedulerOptions = {
            startTime: new Date(),
            endTime:new Date(),
            allDaySlot: false,
            showWorkHours:false

        }
    }

})();