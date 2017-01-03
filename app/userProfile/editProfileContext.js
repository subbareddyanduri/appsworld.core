// Page: Edit Profile 
// Author: Ramesh

(function () {
    'use strict';

    angular
        .module('appsworld')
        .factory('editprofileFactory', editprofileFactory);

    editprofileFactory.$inject = ['$http', 'commonService', 'config', 'serviceConfig'];

    function editprofileFactory($http, commonService, config, serviceConfig) {
        var service = {
            getByIdservice: getByIdservice,
            saveservice: saveservice,
        };
        return service;


        //getby id call

        function getByIdservice() {

            //  var deferred = $q.defer();
            var url = serviceConfig.commonRemoteServer + 'UserAccount?userName=' + config.userName;
            return commonService.getEntities(url)
        }


        //save call
        function saveservice(obj) {
            var url = serviceConfig.commonRemoteServer + 'SaveUserAccount';
            return commonService.saveEntity(url, obj)

        }
    }
})();
