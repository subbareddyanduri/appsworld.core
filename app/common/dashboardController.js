(function () {
    'use strict';
    angular
        .module('appsworld')
        .controller('dashboardController', dashboardController);
    dashboardController.$inject = ['$location']; 
    function dashboardController($location) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'dashboardController';

        activate();

        function activate() {
           // alert("dashboardController");
        }
    }
})();
